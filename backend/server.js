const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const cors = require('cors');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://gurukiran655:AORDVtICSFbGQcw2@cluster0.rrmyl2c.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    await User.syncIndexes();
    console.log('User indexes synced successfully');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Serve React frontend build (make sure path is correct)
if (process.env.NODE_ENV === 'production') {
  // 1️⃣  Serve static files
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // 2️⃣  Serve index.html for every other GET
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
