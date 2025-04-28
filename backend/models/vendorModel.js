const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vendorId: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Vendor', vendorSchema);
