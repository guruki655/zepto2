const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
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

        // Generate JWT token (sign the token)
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'gkr103055',  // Secret key for signing the token (use environment variables in production)
            { expiresIn: '1h' }  // Token expiration time
        );

        // Respond with token and user role
        res.json({
            token,
            role: user.role,
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Users Route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let vendorId = null;
        let customerId = null;

        // If the role is 'vendor', assign vendorId
        if (role === 'vendor') {
            vendorId = await User.getNextId('vendor');
        }

        // If the role is 'customer', assign customerId
        if (role === 'customer') {
            customerId = await User.getNextId('customer');
        }

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            vendorId,
            customerId
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send OTP route
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const otpRecord = new OTP({ phone, otp });
        await otpRecord.save();

        // Here you would integrate your SMS service to send the OTP
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP route
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

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    // Lookup user, send email with reset link/token (mocked here)
    res.json({ message: 'Reset link sent to your email (mock)' });
  });
    
module.exports = router;
