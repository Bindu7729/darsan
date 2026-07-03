const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper role validation
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator clearance required.' });
  }
  next();
};

// @route   POST api/auth/register
// @desc    Register a new devotee or system user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if the user already exists in the system database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already registered with this email account.' });
    }

    // 2. Instantiate the new user model object context
    user = new User({
      name,
      email,
      password,
      role: role || 'devotee' // Falls back to default devotee tier
    });

    // 3. Hash the plain-text password securely via bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Commit the data profile record to MongoDB
    await user.save();

    // 5. Generate and sign a JSON Web Token for immediate authentication
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Registration Pipeline Error:', err.message);
    res.status(500).send('Internal Server Error inside registration pipeline.');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate credentials and sign a session token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validate if user account data profile exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials provided.' });
    }

    // 2. Compare incoming password with hashed database secret key
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials provided.' });
    }

    // 3. Sign dynamic JWT payload session key
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Login Pipeline Error:', err.message);
    res.status(500).send('Internal Server Error inside login routing nodes.');
  }
});

// @route   GET api/auth/users
// @desc    Get all users in the system (Admin Only)
router.get('/users', [auth, adminOnly], async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Fetch Users Error:', err.message);
    res.status(500).send('Internal Server Error fetching user logs.');
  }
});

// @route   PUT api/auth/users/:id/role
// @desc    Update a user's role (Admin Only)
router.put('/users/:id/role', [auth, adminOnly], async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role} successfully!`, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Update User Role Error:', err.message);
    res.status(500).send('Internal Server Error updating user role.');
  }
});

module.exports = router;