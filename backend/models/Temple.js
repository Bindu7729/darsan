const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deity: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: String, default: '0' },
  imageUrl: { type: String, required: true },
  availableSlotsCount: { type: Number, default: 100 },
  isFastFilling: { type: Boolean, default: false },
  ticketPrices: {
    regular: { type: Number, default: 100 },
    vip: { type: Number, default: 500 }
  },
  // Rich details for the temple page
  description: { type: String, default: '' },
  history: { type: String, default: '' },
  facilities: [{ type: String }],
  dressCode: { type: String, default: 'Traditional clothing preferred.' },
  parking: { type: String, default: 'Available near the temple complex.' },
  timings: { type: String, default: 'Morning: 6:00 AM - 12:00 PM, Evening: 4:00 PM - 9:00 PM' },
  specialSevas: [{ type: String }],
  nearbyHotels: [{
    name: { type: String },
    rating: { type: Number },
    distance: { type: String }
  }],
  nearbyRestaurants: [{
    name: { type: String },
    rating: { type: Number },
    distance: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Temple', TempleSchema);