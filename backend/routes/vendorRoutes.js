const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendorModel');
const mongoose = require('mongoose');

// GET - Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ message:'Failed to fetch vendors', error:err.message });
  }
});

// GET - Get a vendor by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message:'Invalid vendor ID' });
    }
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message:'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    console.error('Error fetching vendor by ID:', err);
    res.status(500).json({ message:'Failed to fetch vendor', error:err.message });
  }
});

// POST - Create a new vendor
router.post('/', async (req, res) => {
  try {
    const { name, vendorId, address, licenseNumber } = req.body;
    if (!name || !vendorId || !address || !licenseNumber) {
      return res.status(400).json({ message:'All fields are required' });
    }
    const vendor = new Vendor({ name, vendorId, address, licenseNumber });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    console.error('Error creating vendor:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message:'Vendor ID or license number already exists' });
    }
    res.status(400).json({ message:err.message });
  }
});

// PUT - Update a vendor
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message:'Invalid vendor ID' });
    }
    const { name, vendorId, address, licenseNumber } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (vendorId) updateData.vendorId = vendorId;
    if (address) updateData.address = address;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set:updateData },
      { new:true, runValidators:true }
    );
    if (!vendor) {
      return res.status(404).json({ message:'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    console.error('Error updating vendor:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message:'Vendor ID or license number already exists' });
    }
    res.status(400).json({ message:err.message });
  }
});

// DELETE - Delete a vendor
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message:'Invalid vendor ID' });
    }
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message:'Vendor not found' });
    }
    res.json({ message:'Vendor deleted' });
  } catch (err) {
    console.error('Error deleting vendor:', err);
    res.status(500).json({ message:'Failed to delete vendor', error:err.message });
  }
});

module.exports = router;