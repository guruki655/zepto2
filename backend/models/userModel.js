const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }, // Add phone field
  role: { 
    type: String, 
    enum: ['admin', 'vendor', 'customer'], 
    required: true 
  },
  vendorId: { type: Number, default: null },
  customerId: { type: Number, default: null }
});

userSchema.statics.getNextId = async function(role) {
  const latestUser = await this.findOne({ role }).sort({ [role === 'vendor' ? 'vendorId' : 'customerId']: -1 });
  return latestUser ? latestUser[role === 'vendor' ? 'vendorId' : 'customerId'] + 1 : 1;
};

module.exports = mongoose.model('User', userSchema);