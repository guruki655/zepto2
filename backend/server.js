// In server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vendorRoutes = require('./routes/vendorRoutes'); // Ensure correct path
const customerRoutes=require('./routes/customerRoutes')
const authRoutes=require('./routes/auth')

const app = express();

app.use(cors())

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/zepto2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);  // Ensure this matches the route definition
app.use('/api/customers', customerRoutes);  // Ensure this matches the route definition
app.use('/uploads', express.static('uploads'));


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
