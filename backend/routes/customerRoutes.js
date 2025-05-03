const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const multer = require('multer');
const Order = require('../models/orderModel');
const User = require('../models/userModel'); // Ensure you have the User model

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
      ProductBrand, ProductMaterial 
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
      ProductImage
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update a vendor
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'customer not found' });
    res.json(customer);
  } catch (err) {
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
      const { items, total, email } = req.body;
      console.log('Received order data:', req.body);
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const newOrder = new Order({
        user: user._id,
        items: items, // Directly use the items array
        total,
        createdAt: new Date(),
      });
  
      await newOrder.save();
      console.log('Saved order:', newOrder);
      res.status(201).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ message: 'Failed to save order' });
    }
  });
  router.get('/orders/history/:email', async (req, res) => {
    try {router.post('/orders/save', async (req, res) => {
    try {
      const { items, total, email } = req.body;
      console.log('Received order data:', req.body);
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const newOrder = new Order({
        user: user._id,
        items: items, // Directly use the items array
        total,
        createdAt: new Date(),
      });
  
      await newOrder.save();
      console.log('Saved order:', newOrder);
      res.status(201).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ message: 'Failed to save order' });
    }
  });
      const user = await User.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ message: 'Failed to fetch order history' });
    }
  });

module.exports = router;
