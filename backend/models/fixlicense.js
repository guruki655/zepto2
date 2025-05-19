const mongoose = require('mongoose');
const User = require('./userModel');

mongoose.connect('mongodb+srv://gurukiran655:AORDVtICSFbGQcw2@cluster0.rrmyl2c.mongodb.net/zepto2?retryWrites=true&w=majority')
  .then(async () => {
    // Update documents where licenseNumber is undefined or an empty string
    const result = await User.updateMany(
      { $or: [{ licenseNumber: undefined }, { licenseNumber: "" }] },
      { $set: { licenseNumber: null } }
    );
    console.log('Updated documents:', result);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error updating documents:', err);
    mongoose.connection.close();
  });