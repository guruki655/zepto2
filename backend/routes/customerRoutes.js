const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const multer = require('multer');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

console.log('Loading customer routes');

// Validate route path to prevent invalid patterns
const validateRoutePath = (path) => {
  if (typeof path !== 'string' || path.includes('http://') || path.includes('https://') || path.includes('git.new')) {
    console.error(`Invalid route path detected: ${path}`);
    throw new Error(`Invalid route path: ${path}`);
  }
  console.log(`Validated route: ${path}`);
  return path;
};

// GET all orders for admin dashboard
console.log('Registering route: /orders/all');
router.get(validateRoutePath('/orders/all'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Webhook route
console.log('Registering route: /webhook');
router.post(validateRoutePath('/webhook'), express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      console.log('Webhook received for session:', session.id);
      const { email, items, address, total } = session.metadata;
      let parsedItems = JSON.parse(items || '[]');
      const parsedAddress = JSON.parse(address || '{}');
      const parsedTotal = parseFloat(total || '0');
      console.log('Webhook metadata:', { email, parsedItems, parsedAddress, parsedTotal });
      if (!email || !parsedItems.length || !parsedAddress.addressLine1 || !parsedTotal) {
        console.error('Missing metadata in webhook:', { email, parsedItems, parsedAddress, parsedTotal });
        return res.status(400).json({ message: 'Missing required metadata' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        console.error('User not found for email:', email);
        return res.status(404).json({ message: 'User not found' });
      }
      const validItems = [];
      for (const item of parsedItems) {
        const product = await Customer.findOne({ ProductID: item.ProductID });
        if (!product) {
          console.error(`Product ${item.ProductName} not found, ProductID: ${item.ProductID}`);
          return res.status(404).json({ message: `Product ${item.ProductName} not found` });
        }
        const availableStock = parseInt(product.ProductQuantity);
        if (isNaN(availableStock) || availableStock < item.ProductQuantity) {
          console.error(`Insufficient stock for ${product.ProductName}. Available: ${availableStock}, Requested: ${item.ProductQuantity}`);
          return res.status(400).json({
            message: `Insufficient stock for ${product.ProductName}. Only ${availableStock} available.`,
          });
        }
        item.ProductImage = product.ProductImage || '';
        validItems.push(item);
      }
      for (const item of validItems) {
        try {
          const product = await Customer.findOne({ ProductID: item.ProductID });
          const currentStock = parseInt(product.ProductQuantity);
          const newStock = currentStock - item.ProductQuantity;
          const updatedProduct = await Customer.findOneAndUpdate(
            { ProductID: item.ProductID },
            { $set: { ProductQuantity: newStock.toString() } },
            { new: true }
          );
          if (!updatedProduct) {
            console.error(`Failed to update stock for ProductID: ${item.ProductID}`);
            return res.status(500).json({ message: `Failed to update stock for ${item.ProductName}` });
          }
          console.log(`Updated stock for ${item.ProductName}: ${currentStock} -> ${newStock}`);
        } catch (updateError) {
          console.error(`Error updating stock for ProductID: ${item.ProductID}`, updateError);
          return res.status(500).json({ message: `Failed to update stock for ${item.ProductName}`, error: updateError.message });
        }
      }
      const existingOrder = await Order.findOne({ stripeSessionId: session.id });
      if (existingOrder) {
        console.log('Order already processed:', existingOrder._id);
        return res.json({ received: true });
      }
      const newOrder = new Order({
        user: user._id,
        items: validItems,
        total: parsedTotal,
        address: parsedAddress,
        createdAt: new Date(),
        paymentStatus: 'paid',
        stripeSessionId: session.id,
      });
      await newOrder.save();
      console.log('Order saved via webhook:', newOrder);
      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ message: 'Failed to process webhook', error: error.message });
    }
  } else {
    res.json({ received: true });
  }
});

// GET all products
console.log('Registering route: /');
router.get(validateRoutePath('/'), async (req, res) => {
  try {
    const customer = await Customer.find();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all users
console.log('Registering route: /users');
router.get(validateRoutePath('/users'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new product
console.log('Registering route: / (POST)');
router.post(validateRoutePath('/'), upload.single('ProductImage'), async (req, res) => {
  try {
    const {
      ProductID, ProductName, ProductDescription,
      ProductLocation, ProductPrice, ProductQuantity,
      ProductType, ProductSubType, ProductWeight, ProductShelf,
      ProductBrand, ProductMaterial, ProductRating
    } = req.body;
    const ProductImage = req.file ? req.file.buffer.toString('base64') : '';
    const customer = new Customer({
      ProductID, ProductName, ProductDescription, ProductLocation,
      ProductPrice, ProductQuantity, ProductType, ProductSubType,
      ProductWeight, ProductShelf, ProductBrand, ProductMaterial,
      ProductImage, ProductRating: ProductRating ? parseFloat(ProductRating) : 1
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT update a product
console.log('Registering route: /:id (PUT)');
router.put(validateRoutePath('/:id'), upload.single('ProductImage'), async (req, res) => {
  try {
    const {
      ProductID, ProductName, ProductDescription,
      ProductLocation, ProductPrice, ProductQuantity,
      ProductType, ProductSubType, ProductWeight, ProductShelf,
      ProductBrand, ProductMaterial, ProductRating
    } = req.body;
    const updateData = {
      ProductID, ProductName, ProductDescription, ProductLocation,
      ProductPrice, ProductQuantity, ProductType, ProductSubType,
      ProductWeight, ProductShelf, ProductBrand, ProductMaterial,
      ProductRating: ProductRating ? parseFloat(ProductRating) : undefined
    };
    if (req.file) {
      updateData.ProductImage = req.file.buffer.toString('base64');
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!customer) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
console.log('Registering route: /:id (DELETE)');
router.delete(validateRoutePath('/:id'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'customer not found' });
    res.json({ message: 'customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product by ProductID
console.log('Registering route: /:id');
router.get(validateRoutePath('/:id'), async (req, res) => {
  try {
    const frontEndId = req.params.id;
    const product = await Customer.findOne({ ProductID: frontEndId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create Stripe Checkout session
console.log('Registering route: /create-checkout-session');
router.post(validateRoutePath('/create-checkout-session'), async (req, res) => {
  try {
    const { items, email, address, total } = req.body;
    console.log('API_BASE_URL:', process.env.API_BASE_URL);
    if (!process.env.API_BASE_URL) {
      console.error('API_BASE_URL is not defined');
      return res.status(500).json({ message: 'Server configuration error: API_BASE_URL is missing' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    for (const item of items) {
      const product = await Customer.findOne({ ProductID: item.ProductID });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.ProductName} not found` });
      }
      const availableStock = parseInt(product.ProductQuantity);
      if (isNaN(availableStock) || availableStock < item.ProductQuantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.ProductName}. Only ${availableStock} available.`,
        });
      }
    }
    const lineItems = [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Order Total',
          description: `Order for ${email} with ${items.length} items`,
        },
        unit_amount: Math.round(total * 100),
      },
      quantity: 1,
    }];
    const metadataItems = items.map(({ ProductID, ProductName, ProductPrice, ProductQuantity }) => ({
      ProductID, ProductName, ProductPrice, ProductQuantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment', // Fixed from '-payment'
      success_url: `${process.env.API_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.API_BASE_URL}/cancel`,
      customer_email: email,
      metadata: {
        items: JSON.stringify(metadataItems),
        email,
        address: JSON.stringify(address),
        total: total.toString(),
      },
    });
    console.log('Metadata items length:', JSON.stringify(metadataItems).length);
    if (JSON.stringify(metadataItems).length > 500) {
      console.warn('Metadata items still exceeds 500 characters. Consider further reduction.');
    }
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
});

// POST save order
console.log('Registering route: /orders/save');
router.post(validateRoutePath('/orders/save'), async (req, res) => {
  try {
    let { items, total, email, address, sessionId } = req.body;
    console.log('Received /orders/save request:', { items, total, email, address, sessionId });
    if (!email || !address || !sessionId) {
      console.error('Missing required fields:', { email, address, sessionId });
      return res.status(400).json({ message: 'Missing required fields: email, address, or sessionId' });
    }
    let metadataItems = [];
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== 'paid') {
          console.error('Payment not completed for session:', sessionId);
          return res.status(400).json({ message: 'Payment not completed' });
        }
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
        if (existingOrder) {
          console.log('Order already saved:', existingOrder._id);
          return res.status(200).json({ message: 'Order already saved', order: existingOrder });
        }
        metadataItems = session.metadata.items ? JSON.parse(session.metadata.items) : [];
        const metadataEmail = session.metadata.email;
        const metadataAddress = session.metadata.address ? JSON.parse(session.metadata.address) : {};
        const metadataTotal = session.metadata.total ? parseFloat(session.metadata.total) : 0;
        items = items || metadataItems;
        email = email || metadataEmail;
        address = address || metadataAddress;
        total = total || metadataTotal;
      } catch (stripeError) {
        console.error('Error retrieving Stripe session:', stripeError);
        return res.status(400).json({ message: 'Invalid Stripe session', error: stripeError.message });
      }
    }
    if (!items || !items.length || !total) {
      console.error('Missing items or total:', { items, total });
      return res.status(400).json({ message: 'Missing items or total' });
    }
    console.log('Processed order data:', { items, total, email, address });
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    const validItems = [];
    for (const item of items) {
      const product = await Customer.findOne({ ProductID: item.ProductID });
      if (!product) {
        console.error(`Product not found: ${item.ProductName}, ProductID: ${item.ProductID}`);
        return res.status(404).json({ message: `Product ${item.ProductName} not found` });
      }
      const availableStock = parseInt(product.ProductQuantity);
      if (isNaN(availableStock) || availableStock < item.ProductQuantity) {
        console.error(`Insufficient stock for ${product.ProductName}. Available: ${availableStock}, Requested: ${item.ProductQuantity}`);
        return res.status(400).json({
          message: `Insufficient stock for ${product.ProductName}. Only ${availableStock} available.`,
        });
      }
      item.ProductImage = item.ProductImage || product.ProductImage || '';
      validItems.push(item);
    }
    for (const item of validItems) {
      try {
        const product = await Customer.findOne({ ProductID: item.ProductID });
        const currentStock = parseInt(product.ProductQuantity);
        const newStock = currentStock - item.ProductQuantity;
        const updatedProduct = await Customer.findOneAndUpdate(
          { ProductID: item.ProductID },
          { $set: { ProductQuantity: newStock.toString() } },
          { new: true }
        );
        if (!updatedProduct) {
          console.error(`Failed to update stock for ProductID: ${item.ProductID}`);
          return res.status(500).json({ message: `Failed to update stock for ${item.ProductName}` });
        }
        console.log(`Updated stock for ${item.ProductName}: ${currentStock} -> ${newStock}`);
      } catch (updateError) {
        console.error(`Error updating stock for ProductID: ${item.ProductID}`, updateError);
        return res.status(500).json({ message: `Failed to update stock for ${item.ProductName}`, error: updateError.message });
      }
    }
    const newOrder = new Order({
      user: user._id,
      items: validItems,
      total,
      address,
      createdAt: new Date(),
      paymentStatus: sessionId ? 'paid' : 'pending',
      stripeSessionId: sessionId || null,
    });
    await newOrder.save();
    console.log('Saved order:', newOrder);
    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Failed to save order', error: error.message });
  }
});

// GET order history
console.log('Registering route: /orders/history/:email');
router.get(validateRoutePath('/orders/history/:email'), async (req, res) => {
  try {
    console.log('Fetching order history for email:', req.params.email);
    const user = await User.findOne({ email: { $regex: new RegExp(`^${req.params.email}$`, 'i') } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log('Found user for order history:', user);
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    console.log('Retrieved orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Failed to fetch order history', error: error.message });
  }
});

// PUT update user address
console.log('Registering route: /users/update-address');
router.put(validateRoutePath('/users/update-address'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }
    const requiredFields = ['addressLine1', 'houseNo', 'building'];
    for (const field of requiredFields) {
      if (!address[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, 'gkr103055');
    } catch (jwtErr) {
      console.error('JWT verification error:', jwtErr);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    const userId = decoded.userId;
    console.log('Decoded userId:', userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Updated user:', updatedUser);
    res.json({ message: 'Address updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating address:', err);
    res.status(500).json({ message: 'Error updating address', error: err.message });
  }
});

// GET user's saved address
console.log('Registering route: /users/address');
router.get(validateRoutePath('/users/address'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authorization token missing' });
    const decoded = jwt.verify(token, 'gkr103055');
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ address: user.address || null });
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).json({ message: 'Error fetching address', error: err.message });
  }
});

module.exports = router;