const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Temple = require('../models/Temple');
const auth = require('../middleware/auth');

// @route   POST api/bookings
// @desc    Create a formal Darshan reservation pass document
router.post('/', auth, async (req, res) => {
  const { templeId, reportingDate, timeSlot, ticketType, devotees, payableSum } = req.body;

  try {
    // 1. Verify the temple destination exists in the registry database
    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ message: 'Target temple destination registry not found.' });
    }

    // 2. Enforce real-time capacity slot count allocation warnings
    if (temple.availableSlotsCount < devotees.length) {
      return res.status(400).json({ message: 'Insufficient remaining slot capacity for this group size.' });
    }

    // 3. Generate a structural randomized token alphanumeric tracking reference
    const operationalCode = temple.name.substring(0, 3).toUpperCase();
    const uniqueSalt = Math.floor(1000 + Math.random() * 9000);
    const generatedBookingId = `DE-${operationalCode}-2026-${uniqueSalt}`;

    // 4. Instantiate the structural reservation passport document object
    const newBooking = new Booking({
      user: req.user.userId, // Authenticated user ID from token
      temple: templeId,
      bookingId: generatedBookingId,
      reportingDate,
      timeSlot,
      ticketType,
      devotees,
      payableSum,
      status: 'Confirmed'
    });

    // 5. Deduct capacity count from the target profile node
    temple.availableSlotsCount -= devotees.length;
    if (temple.availableSlotsCount <= 15) {
      temple.isFastFilling = true;
    }

    // 6. Commit atomic state saves to MongoDB registers
    await temple.save();
    await newBooking.save();

    res.status(201).json({ message: 'Booking confirmed successfully!', booking: newBooking });

  } catch (err) {
    console.error('Booking Engine Failure:', err.message);
    res.status(500).send('Internal Server Error processing reservation ledger tokens.');
  }
});

// @route   GET api/bookings/my
// @desc    Get bookings of the currently logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('temple')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Fetch My Bookings Error:', err.message);
    res.status(500).send('Internal Server Error fetching personal booking logs.');
  }
});

// @route   GET api/bookings
// @desc    Get all bookings (Admin/Organizer Only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Insufficient clearance.' });
    }
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('temple')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Fetch All Bookings Error:', err.message);
    res.status(500).send('Internal Server Error fetching all system bookings.');
  }
});

// @route   PUT api/bookings/:bookingId/checkin
// @desc    Scan and check-in devotee at the temple gate (Organizer/Admin Only)
router.put('/:bookingId/checkin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Insufficient clearance.' });
    }

    const booking = await Booking.findOne({ bookingId: req.params.bookingId }).populate('temple');
    if (!booking) {
      return res.status(404).json({ message: 'Ticket booking ID not found in database records.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'This ticket has been cancelled.' });
    }

    // Toggle check in status or keep Confirmed. If we want check-in telemetry, let's mark it as CheckedIn or similar
    // We can add a property or use the status. Let's make it CheckedIn if it's confirmed
    if (booking.status === 'CheckedIn') {
      return res.status(400).json({ message: 'Devotee has already checked in.' });
    }

    booking.status = 'CheckedIn';
    await booking.save();

    res.json({ 
      message: 'Access Granted. Devotee Checked In Successfully.', 
      booking 
    });
  } catch (err) {
    console.error('Gate Validation Error:', err.message);
    res.status(500).send('Internal Server Error validating ticket checkin.');
  }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking (User or Admin)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Enforce that only the booker or admin can cancel it
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized action.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    booking.status = 'Cancelled';
    
    // Refund the slots
    const temple = await Temple.findById(booking.temple);
    if (temple) {
      temple.availableSlotsCount += booking.devotees.length;
      await temple.save();
    }

    await booking.save();
    res.json({ message: 'Booking cancelled successfully!', booking });
  } catch (err) {
    console.error('Cancel Booking Error:', err.message);
    res.status(500).send('Internal Server Error cancelling booking.');
  }
});

module.exports = router;