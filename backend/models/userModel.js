const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'customer'],
    required: true,
  },
  vendorId: { type: Number, default: null },
  customerId: { type: Number, default: null },
  licenseNumber: { type: String, default: null, unique: true, sparse: true },

  address: {
    addressLine1: { type: String, default: '' },
    houseNo: { type: String, default: '' },
    building: { type: String, default: '' },
    landmark: { type: String, default: '' },
    label: { type: String, default: 'Home' },
  },
});

userSchema.statics.getNextId = async function (role) {
  const latestUser = await this.findOne({ role }).sort({
    [role === 'vendor' ? 'vendorId' : 'customerId']: -1,
  });
  return latestUser
    ? latestUser[role === 'vendor' ? 'vendorId' : 'customerId'] + 1
    : 1;
};

module.exports = mongoose.model('User', userSchema);