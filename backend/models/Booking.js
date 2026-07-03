const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  bookingId: { type: String, required: true, unique: true },
  reportingDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  ticketType: { type: String, enum: ['regular', 'vip'], default: 'regular' },
  devotees: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    idType: { type: String, required: true },
    idNumber: { type: String, required: true }
  }],
  payableSum: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);