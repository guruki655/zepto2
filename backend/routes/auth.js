const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

module.exports = router;
