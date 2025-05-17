const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/auth');

const app = express(); // Moved this above usage

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/uploads', express.static('uploads'));

// Serve frontend build
const buildpath = path.join(__dirname, 'build');
app.use(express.static(buildpath));

// Catch-all for SPA routes (optional if using React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildpath, 'index.html'));
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gurukiran655:TOvZkpHYvvHkksF2@cluster0.rrmyl2c.mongodb.net/';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
