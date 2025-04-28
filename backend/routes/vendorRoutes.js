const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendorModel');

router.get('/', async (req, res) => {
    
    try {
      const vendors = await Vendor.find();
      res.json(vendors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// POST - Create a new vendor
router.post('/', async (req, res) => {
    try {
        const vendor = new Vendor(req.body);
        await vendor.save();
        res.status(201).json(vendor);
    } catch (err) {
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
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE - Delete a vendor
router.delete('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ message: 'Vendor deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
