const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/auth');

const app = express();

// Apply CORS and JSON parsing globally, except for webhook
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/zepto2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));