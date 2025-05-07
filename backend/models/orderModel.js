const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      ProductName: { type: String, required: true },
      ProductPrice: { type: Number, required: true },
      ProductQuantity: { type: Number, required: true },
      ProductImage: { type: String, default: '' }, 
    },
  ],
  total: { type: Number, required: true },
  address: {
    addressLine1: { type: String, default: '' },
    houseNo: { type: String, default: '' },
    building: { type: String, default: '' },
    landmark: { type: String, default: '' },
    label: { type: String, default: 'Home' },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);