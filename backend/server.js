const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load secure environment variables from .env file
dotenv.config();

const app = express();

// Global Pipeline Middleware Setup
app.use(cors());
app.use(express.json()); 

// Mongoose Connection Node
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🕉️  DarshanEase Database Core Linked Successfully.'))
  .catch((err) => console.error('❌ Database Sync Collision:', err));

// LINK MODULAR ROUTING PIPELINES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/temples', require('./routes/temples')); 
app.use('/api/bookings', require('./routes/bookings')); // Live Transaction Booking Routes

// Initial Context Ping Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'Active', 
    message: 'DarshanEase REST Service Pipeline running operational.' 
  });
});

// Configure Port Framework
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 System Server executing smoothly on port http://localhost:${PORT}`);
});