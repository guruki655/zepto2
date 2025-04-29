const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const multer = require('multer');

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
            ProductType, ProductSubType,ProductWeight, ProductShelf, 
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

// GET - Get all vendors
// router.get('/', async (req, res) => {
//     try {
//         const vendors = await Vendor.find();
//         res.json(vendors);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

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

// Change this route to match your model and endpoint
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
module.exports = router;
