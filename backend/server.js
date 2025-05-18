const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend build files
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/uploads', express.static('uploads'));

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
