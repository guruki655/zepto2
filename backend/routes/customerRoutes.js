const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const multer = require('multer');
const Order = require('../models/orderModel');
const User = require('../models/userModel'); // Ensure you have the User model
const jwt = require('jsonwebtoken');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const customer = await Customer.find();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create a new vendor
// POST create new customer (with image)
router.post('/', upload.single('ProductImage'), async (req, res) => {
  try {
    const {
      ProductID, ProductName, ProductDescription,
      ProductLocation, ProductPrice, ProductQuantity,
      ProductType, ProductSubType, ProductWeight, ProductShelf,
      ProductBrand, ProductMaterial, ProductRating
    } = req.body;

    const ProductImage = req.file ? req.file.buffer.toString('base64') : '';

    const customer = new Customer({
      ProductID,
      ProductName,
      ProductDescription,
      ProductLocation,
      ProductPrice,
      ProductQuantity,
      ProductType,
      ProductSubType,
      ProductWeight,
      ProductShelf,
      ProductBrand,
      ProductMaterial,
      ProductImage,
      ProductRating: ProductRating ? parseFloat(ProductRating) : 1 // Default to 1 if not provided
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update a vendor
router.put('/:id', upload.single('ProductImage'), async (req, res) => {
  try {
    const {
      ProductID, ProductName, ProductDescription,
      ProductLocation, ProductPrice, ProductQuantity,
      ProductType, ProductSubType, ProductWeight, ProductShelf,
      ProductBrand, ProductMaterial, ProductRating
    } = req.body;

    const updateData = {
      ProductID,
      ProductName,
      ProductDescription,
      ProductLocation,
      ProductPrice,
      ProductQuantity,
      ProductType,
      ProductSubType,
      ProductWeight,
      ProductShelf,
      ProductBrand,
      ProductMaterial,
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

// DELETE - Delete a vendor
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'customer not found' });
    res.json({ message: 'customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get product by ProductID
router.get('/:id', async (req, res) => {
  try {
    const frontEndId = req.params.id; // Get the ProductID from the URL
    const product = await Customer.findOne({ ProductID: frontEndId }); // Query by ProductID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // POST - Save an order
// router.post('/api/orders', async (req, res) => {
//   try {
//     const { userId, items, total } = req.body;
//     const newOrder = new Order({ userId, items, total });
//     await newOrder.save();
//     res.status(201).json({ message: 'Order saved successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save order' });
//   }
// });

// POST - Save order with user email
router.post('/orders/save', async (req, res) => {
  try {
    const { items, total, email, address } = req.body;
    console.log('Received order data:', req.body);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate stock and fetch ProductImage
    for (const item of items) {
      const product = await Customer.findOne({ ProductID: item.ProductID });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.ProductName} not found` });
      }

      const availableStock = parseInt(product.ProductQuantity);
      if (isNaN(availableStock)) {
        return res.status(400).json({ message: `Invalid stock value for ${product.ProductName}` });
      }
      if (availableStock < item.ProductQuantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.ProductName}. Only ${availableStock} available.`,
        });
      }

      // Ensure ProductImage is included in the item
      item.ProductImage = product.ProductImage || ''; // Copy ProductImage from Customer
    }

    // Update stock for all items
    for (const item of items) {
      const product = await Customer.findOne({ ProductID: item.ProductID });
      const currentStock = parseInt(product.ProductQuantity);
      const newStock = currentStock - item.ProductQuantity;
      await Customer.findOneAndUpdate(
        { ProductID: item.ProductID },
        { $set: { ProductQuantity: newStock.toString() } },
        { new: true }
      );
    }

    // Save the order
    const newOrder = new Order({
      user: user._id,
      items,
      total,
      address,
      createdAt: new Date(),
    });

    await newOrder.save();
    console.log('Saved order:', newOrder);
    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Failed to save order', error: error.message });
  }
});

  router.get('/orders/history/:email', async (req, res) => {
    try {
      console.log('Fetching order history for email:', req.params.email);
      // Case-insensitive email match
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
  //update adress
  router.put('/users/update-address', async (req, res) => {
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

  // GET - Fetch user's saved address
router.get('/users/address', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authorization token missing' });

    const decoded = jwt.verify(token, 'gkr103055'); // Use your JWT secret
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
