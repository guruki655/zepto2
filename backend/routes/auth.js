const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const OTP = require('../models/otpModel');

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare hashed password with input
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'gkr103055',
      { expiresIn: '1h' }
    );

    // Respond with token, role, userId, and email
    res.json({
      token,
      role: user.role,
      userId: user._id,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Users Route
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User Route (for licenseNumber)
router.put('/users/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const { licenseNumber } = req.body;
    if (!licenseNumber) {
      return res.status(400).json({ message: 'License number is required' });
    }

    const updateData = { licenseNumber };
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'License number already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    console.log('Received payload:', req.body);
    const { name, email, password, role, phone, licenseNumber } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        message: 'Missing required fields',
        received: req.body
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let vendorId = null;
    let customerId = null;

    if (role === 'vendor') {
      vendorId = await User.getNextId('vendor');
    }
    if (role === 'customer') {
      customerId = await User.getNextId('customer');
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      vendorId,
      customerId,
      licenseNumber
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // Get the field causing the duplicate error
      if (field === 'email') {
        return res.status(400).json({ message: 'Email already registered' });
      } else if (field === 'licenseNumber') {
        return res.status(400).json({ message: 'License number already in use' });
      } else {
        return res.status(400).json({ message: `Duplicate field error: ${field}` });
      }
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Send OTP Route
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Check if phone is already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Delete any existing OTP for this phone
    await OTP.deleteOne({ phone });

    const otpRecord = new OTP({ phone, otp });
    await otpRecord.save();

    console.log(`OTP ${otp} sent to ${phone}`); // Mock SMS
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error:', err.stack); // Enhanced error logging
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP Route
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Received email:', email);

    const user = await User.findOne({ email });
    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.phone) {
      return res.status(400).json({ message: 'User has no registered phone number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    // Delete any existing OTP for this phone
    await OTP.deleteOne({ phone: user.phone });

    const otpRecord = new OTP({ phone: user.phone, otp });
    await otpRecord.save();
    console.log('Created OTP record:', otpRecord);

    console.log(`OTP ${otp} sent to ${user.phone}`);
    res.status(200).json({ message: 'OTP sent to your registered phone number' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP for Password Reset
router.post('/verify-otp-reset', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpRecord = await OTP.findOne({ phone: user.phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Generate a reset token (valid for 10 minutes)
    const resetToken = jwt.sign({ userId: user._id }, 'gkr103055', { expiresIn: '10m' });
    res.status(200).json({ success: true, resetToken, message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, 'gkr103055');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token expired' });
    }
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Profile Route
router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;