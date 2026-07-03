const express = require('express');
const router = express.Router();
const Temple = require('../models/Temple');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Helper role validation
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator clearance required.' });
  }
  next();
};

// @route   GET api/temples
// @desc    Get all temples listed in the database directory
router.get('/', async (req, res) => {
  try {
    const temples = await Temple.find({});
    res.json(temples);
  } catch (err) {
    console.error('Fetch Temples Error:', err.message);
    res.status(500).send('Internal Server Error fetching temple datasets.');
  }
});

// @route   GET api/temples/:id
// @desc    Get details of a single temple
router.get('/:id', async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({ message: 'Temple registry record not found.' });
    }
    res.json(temple);
  } catch (err) {
    console.error('Fetch Temple Detail Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Temple registry record not found.' });
    }
    res.status(500).send('Internal Server Error fetching temple detail profile.');
  }
});

// @route   POST api/temples
// @desc    Create a new temple (Admin Only)
router.post('/', [auth, adminOnly], async (req, res) => {
  try {
    const newTemple = new Temple(req.body);
    await newTemple.save();
    res.status(201).json({ message: 'Temple registered successfully!', temple: newTemple });
  } catch (err) {
    console.error('Create Temple Error:', err.message);
    res.status(500).send('Internal Server Error creating temple registry record.');
  }
});

// @route   PUT api/temples/:id
// @desc    Update an existing temple (Admin or Organizer)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Insufficient clearance.' });
    }

    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!temple) {
      return res.status(404).json({ message: 'Temple registry record not found.' });
    }
    res.json({ message: 'Temple record updated successfully!', temple });
  } catch (err) {
    console.error('Update Temple Error:', err.message);
    res.status(500).send('Internal Server Error updating temple record.');
  }
});

// @route   DELETE api/temples/:id
// @desc    Delete a temple (Admin Only)
router.delete('/:id', [auth, adminOnly], async (req, res) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) {
      return res.status(404).json({ message: 'Temple registry record not found.' });
    }
    await Review.deleteMany({ temple: req.params.id });
    res.json({ message: 'Temple and associated reviews purged successfully!' });
  } catch (err) {
    console.error('Delete Temple Error:', err.message);
    res.status(500).send('Internal Server Error deleting temple registry record.');
  }
});

// @route   GET api/temples/:id/reviews
// @desc    Get reviews for a single temple
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ temple: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Fetch Reviews Error:', err.message);
    res.status(500).send('Internal Server Error retrieving reviews.');
  }
});

// @route   POST api/temples/:id/reviews
// @desc    Post a review for a temple (Auth Required)
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({ message: 'Temple not found.' });
    }

    const newReview = new Review({
      user: req.user.userId,
      temple: req.params.id,
      rating: Number(rating),
      comment,
      userName: req.body.userName || 'Anonymous Devotee'
    });

    await newReview.save();

    const reviews = await Review.find({ temple: req.params.id });
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    temple.rating = parseFloat(avgRating.toFixed(1));
    temple.reviewsCount = reviews.length.toString();
    await temple.save();

    res.status(201).json({ message: 'Review submitted successfully!', review: newReview, rating: temple.rating, reviewsCount: temple.reviewsCount });
  } catch (err) {
    console.error('Submit Review Error:', err.message);
    res.status(500).send('Internal Server Error submitting temple review.');
  }
});

// @route   POST api/temples/seed
// @desc    Seed initial mock temple records for testing landing page grids (Pan-India)
router.post('/seed', async (req, res) => {
  const seedTemples = [
    {
      name: "Kedarnath Temple",
      deity: "Lord Shiva",
      location: "Garhwal Himalayas, Uttarakhand",
      state: "Uttarakhand",
      rating: 4.9,
      reviewsCount: "12K",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
      availableSlotsCount: 12,
      isFastFilling: true,
      ticketPrices: { regular: 100, vip: 500 },
      description: "One of the most sacred pilgrimage sites, Kedarnath Temple is nestled in the Garhwal Himalayas of Uttarakhand, near the Mandakini River. It is open to the public only between April and November due to extreme winter weather conditions.",
      history: "According to Hindu mythology, the temple was built by the Pandavas to seek forgiveness from Lord Shiva. It was later revived by Adi Sankaracharya in the 8th century.",
      facilities: ["Resting Halls", "Medical Camps", "Free Dining (Bhandara)", "Cloakrooms", "Helipad Service"],
      dressCode: "Traditional, warm clothing is highly recommended due to the sub-zero temperatures.",
      parking: "Available at Sonprayag (base camp). Access to temple is by trek or helicopter.",
      timings: "Morning Darshan: 4:00 AM - 12:00 PM, Evening Darshan: 5:00 PM - 9:00 PM",
      specialSevas: ["Mahabhishek Pooja", "Rudra Abhishek", "Shravan Pooja", "Aarti Seva"],
      nearbyHotels: [
        { name: "Himalayan Comfort Resort", rating: 4.6, distance: "1.2 km from base" },
        { name: "Kedarnath Tourist Lodge (GMVN)", rating: 4.2, distance: "0.5 km" }
      ],
      nearbyRestaurants: [
        { name: "Garhwal Bhojnalaya", rating: 4.4, distance: "0.2 km" },
        { name: "Shiva Cafe & Meals", rating: 4.1, distance: "0.4 km" }
      ]
    },
    {
      name: "Kashi Vishwanath Temple",
      deity: "Lord Shiva",
      location: "Varanasi, Uttar Pradesh",
      state: "Uttar Pradesh",
      rating: 4.8,
      reviewsCount: "28K",
      imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600",
      availableSlotsCount: 140,
      isFastFilling: false,
      ticketPrices: { regular: 150, vip: 600 },
      description: "Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India, on the western bank of the holy river Ganga.",
      history: "The current structure was constructed by the Maratha monarch Ahilyabai Holkar of Indore in 1780.",
      facilities: ["Locker Facility", "VIP Lounge", "Drinking Water Centers", "Wheelchairs for Seniors", "Ganga Aarti Viewing Deck"],
      dressCode: "Traditional Indian attire is strictly enforced. Avoid shorts or short skirts.",
      parking: "Available at Godowlia Multi-level Parking (1.5 km away). Use local e-rickshaws.",
      timings: "Darshan Timings: 4:00 AM - 11:00 PM daily. Sugam Darshan (VIP) has priority hours.",
      specialSevas: ["Rudrabhishek Seva", "Saptarishi Aarti", "Mangala Aarti", "Bhoga Aarti"],
      nearbyHotels: [
        { name: "BrijRama Palace Heritage", rating: 4.8, distance: "0.3 km on Dashashwamedh Ghat" },
        { name: "Alka Guest House", rating: 4.3, distance: "0.1 km" }
      ],
      nearbyRestaurants: [
        { name: "Kashi Chat Bhandar", rating: 4.7, distance: "0.8 km" },
        { name: "Blue Lassi Shop", rating: 4.5, distance: "0.4 km" }
      ]
    },
    {
      name: "Tirupati Balaji Temple",
      deity: "Lord Venkateswara",
      location: "Tirumala, Andhra Pradesh",
      state: "Andhra Pradesh",
      rating: 4.9,
      reviewsCount: "45K",
      imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=600",
      availableSlotsCount: 5,
      isFastFilling: true,
      ticketPrices: { regular: 300, vip: 1000 },
      description: "Sri Venkateswara Temple is a landmark temple in the hill town of Tirumala at Tirupati in Chittoor district of Andhra Pradesh, India. The Temple is dedicated to Lord Venkateswara, an incarnation of Vishnu.",
      history: "Built on the Tirumala Hills, the temple's history dates back to at least the 4th century AD.",
      facilities: ["Free Laddu Prasadam", "Tonsuring centers", "Free Mass Transit Buses", "Gigantic Dining Halls"],
      dressCode: "Dhoti/Kurta for Men, Saree/Salwar Kameez with Dupatta for Women.",
      parking: "Huge parking grounds in Tirumala. Vehicles checked at Alipiri Gate.",
      timings: "Sarvadarsanam (Free): Variable wait times. Special Entry Darshan (INR 300): Pre-booked 2-hour window.",
      specialSevas: ["Kalyanotsavam", "Suprabhata Seva", "Thomala Seva"],
      nearbyHotels: [
        { name: "Taj Tirupati", rating: 4.7, distance: "15 km" },
        { name: "Marasa Sarovar Premiere", rating: 4.5, distance: "13 km" }
      ],
      nearbyRestaurants: [
        { name: "Hotel Saravana Bhavan", rating: 4.3, distance: "0.2 km" }
      ]
    },
    {
      name: "Vaishno Devi Temple",
      deity: "Mata Vaishno Devi",
      location: "Katra, Jammu and Kashmir",
      state: "Jammu & Kashmir",
      rating: 4.9,
      reviewsCount: "35K",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600",
      availableSlotsCount: 85,
      isFastFilling: false,
      ticketPrices: { regular: 50, vip: 2000 },
      description: "The holy cave shrine of Vaishno Devi is nestled in the Trikuta Mountains of Jammu and Kashmir. Millions of devotees trek 12 km from Katra to seek the blessings of the Mother Goddess.",
      history: "A natural cave believed to be the home of three natural rock formations (Pindies) representing Maha Kali, Maha Lakshmi, and Maha Saraswati.",
      facilities: ["Battery Car service", "Helicopter Booking", "Porters & Ponies", "Dharamshalas", "Free Dining Halls"],
      dressCode: "Decent clothing suitable for mountain trekking. Avoid high heels.",
      parking: "Available at Katra base station.",
      timings: "Open 24 hours daily. Aarti takes place twice a day.",
      specialSevas: ["Atka Aarti", "Shradha Suman Gupha Darshan"],
      nearbyHotels: [
        { name: "Welcomhotel by ITC Katra", rating: 4.6, distance: "1.5 km from Station" },
        { name: "White Hotels Katra", rating: 4.3, distance: "0.8 km" }
      ],
      nearbyRestaurants: [
        { name: "Prem Vaishno Dhabha", rating: 4.4, distance: "0.1 km" }
      ]
    },
    {
      name: "Siddhivinayak Temple",
      deity: "Lord Ganesha",
      location: "Prabhadevi, Mumbai, Maharashtra",
      state: "Maharashtra",
      rating: 4.8,
      reviewsCount: "50K",
      imageUrl: "/siddhivinayak.png",
      availableSlotsCount: 90,
      isFastFilling: true,
      ticketPrices: { regular: 50, vip: 1500 },
      description: "The Shree Siddhivinayak Ganapati Temple is a Hindu temple dedicated to Lord Shri Ganesha. It is located in Prabhadevi, Mumbai, Maharashtra, and is one of the richest temples in India.",
      history: "Originally built by Laxman Vithu and Deubai Patil in 1801, it has transformed into a major architectural landmark.",
      facilities: ["Locker facility", "Drinking Water", "Seniors Priority Lanes", "Prasadam Stalls"],
      dressCode: "Formals or traditional Indian attire. Avoid revealing clothes.",
      parking: "Very limited street parking. Public transport is highly recommended.",
      timings: "5:30 AM - 10:00 PM daily. Tuesdays are heavily crowded.",
      specialSevas: ["Aarti Seva", "Sahasranama Archana"],
      nearbyHotels: [
        { name: "The Taj Mahal Palace", rating: 4.9, distance: "12 km" },
        { name: "Hotel City Point Dadar", rating: 4.0, distance: "2 km" }
      ],
      nearbyRestaurants: [
        { name: "Gypsy Chinese Dadar", rating: 4.2, distance: "1.8 km" }
      ]
    },
    {
      name: "Jagannath Temple",
      deity: "Lord Jagannath",
      location: "Puri, Odisha",
      state: "Odisha",
      rating: 4.8,
      reviewsCount: "25K",
      imageUrl: "/jagannath.png",
      availableSlotsCount: 60,
      isFastFilling: false,
      ticketPrices: { regular: 100, vip: 800 },
      description: "The Jagannath Temple is an important Hindu temple dedicated to Jagannath, a form of Sri Krishna, located in Puri in the state of Odisha on the eastern coast of India.",
      history: "Built by King Anatavarman Chodaganga Deva in the 12th century, famous for its annual Ratha Yatra (Chariot Festival).",
      facilities: ["Mahaprasad Dining (Ananda Bazar)", "Cloakrooms", "Footwear stands", "Restrooms"],
      dressCode: "Strict Indian traditional wear only. Leather belts and wallets are prohibited inside.",
      parking: "Available at Jagannath Ballav parking lot (1 km from temple).",
      timings: "5:00 AM - 11:00 PM daily.",
      specialSevas: ["Mangala Alati", "Sandhya Dhupa"],
      nearbyHotels: [
        { name: "Mayfair Waves Puri", rating: 4.7, distance: "2 km" },
        { name: "Sterling Puri", rating: 4.4, distance: "4.5 km" }
      ],
      nearbyRestaurants: [
        { name: "Grand Road Bhojanalaya", rating: 4.2, distance: "0.2 km" }
      ]
    },
    {
      name: "Somnath Temple",
      deity: "Lord Shiva",
      location: "Veraval, Gujarat",
      state: "Gujarat",
      rating: 4.9,
      reviewsCount: "15K",
      imageUrl: "/somnath.png",
      availableSlotsCount: 75,
      isFastFilling: false,
      ticketPrices: { regular: 50, vip: 500 },
      description: "The Somnath Temple, located in Prabhas Patan near Veraval in Saurashtra on the western coast of Gujarat, is believed to be the first among the twelve Jyotirlinga shrines of Lord Shiva.",
      history: "Destroyed and reconstructed multiple times, the current temple was built in Chalukya style in 1951 led by Sardar Patel.",
      facilities: ["Sound and Light Show", "Somnath Museum", "Dharamshalas", "Locker Room"],
      dressCode: "Formal dress code required. Short trousers or skirts are strictly prohibited.",
      parking: "Spacious parking grounds near the main entrance gates.",
      timings: "6:00 AM - 9:30 PM. Light show starts at 8:00 PM.",
      specialSevas: ["Somnath Mahapuja", "Gangajala Abhisheka"],
      nearbyHotels: [
        { name: "The Fern Residency Somnath", rating: 4.5, distance: "1.8 km" },
        { name: "Lords Inn Somnath", rating: 4.2, distance: "1.0 km" }
      ],
      nearbyRestaurants: [
        { name: "Sagar Food Court", rating: 4.1, distance: "0.3 km" }
      ]
    },
    {
      name: "Golden Temple",
      deity: "Guru Granth Sahib",
      location: "Amritsar, Punjab",
      state: "Punjab",
      rating: 4.9,
      reviewsCount: "40K",
      imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=600",
      availableSlotsCount: 200,
      isFastFilling: false,
      ticketPrices: { regular: 0, vip: 0 },
      description: "Sri Harmandir Sahib, also known as the Golden Temple, is the preeminent spiritual site of Sikhism, located in the city of Amritsar, Punjab, India. It represents open brotherhood and equality.",
      history: "Founded in 1577 by the fourth Sikh Guru, Guru Ram Das. The golden foil covering was added by Maharaja Ranjit Singh in 1830.",
      facilities: ["Free Kitchen (Langar) feeding 100K daily", "Information Office", "Free Dormitories", "Wheelchairs"],
      dressCode: "Head must be covered at all times. Feet must be washed before entry. Traditional attire preferred.",
      parking: "Available at Multi-level Golden Temple Parking.",
      timings: "Open 24 hours daily.",
      specialSevas: ["Kirtan Seva", "Langar Seva (Voluntary)"],
      nearbyHotels: [
        { name: "Hyatt Regency Amritsar", rating: 4.6, distance: "4 km" },
        { name: "Ramada by Wyndham Amritsar", rating: 4.3, distance: "1.2 km" }
      ],
      nearbyRestaurants: [
        { name: "Kesar Da Dhaba", rating: 4.6, distance: "0.8 km" }
      ]
    },
    {
      name: "Meenakshi Amman Temple",
      deity: "Goddess Meenakshi",
      location: "Madurai, Tamil Nadu",
      state: "Tamil Nadu",
      rating: 4.9,
      reviewsCount: "22K",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
      availableSlotsCount: 50,
      isFastFilling: true,
      ticketPrices: { regular: 50, vip: 500 },
      description: "Historic Hindu temple located on the southern bank of the Vaigai River in Madurai, Tamil Nadu. Dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar (Shiva).",
      history: "Dating back to ancient times, rebuilt in the 16th-17th centuries by the Nayak rulers.",
      facilities: ["Locker room", "Aura Guided Tour guides", "Medical first-aid", "Drinking water stations"],
      dressCode: "Traditional South Indian wear required (Dhoti/Veshti for Men, Saree/Churidar for Women). Mobile phones prohibited inside.",
      parking: "Available at temple municipality parking grounds (0.5 km away).",
      timings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM daily.",
      specialSevas: ["Thanga Ther (Golden Chariot) Puja", "Abhishekam Seva"],
      nearbyHotels: [
        { name: "Heritage Madurai", rating: 4.6, distance: "4.5 km" },
        { name: "Courtyard by Marriott Madurai", rating: 4.5, distance: "3.5 km" }
      ],
      nearbyRestaurants: [
        { name: "Murugan Idli Shop", rating: 4.4, distance: "0.3 km" }
      ]
    },
    {
      name: "Sabarimala Temple",
      deity: "Lord Ayyappa",
      location: "Pathanamthitta, Kerala",
      state: "Kerala",
      rating: 4.9,
      reviewsCount: "30K",
      imageUrl: "/sabarimala.png",
      availableSlotsCount: 15,
      isFastFilling: true,
      ticketPrices: { regular: 150, vip: 1000 },
      description: "Sabarimala Sree Dharma Sastha Temple is a temple complex located at Sabarimala hill inside the Periyar Tiger Reserve in Kerala, India. It is situated on a hilltop at an altitude of 1,260 m above mean sea level.",
      history: "Associated with Lord Ayyappa, who is believed to have meditated here after destroying the demoness Mahishi.",
      facilities: ["Medical centers", "Trek resting sheds", "Free feeding (Annadanam)", "Clockrooms"],
      dressCode: "Traditional black/blue attire. Carrying the Irumudi Kettu is traditional for scaling the 18 steps.",
      parking: "Available at Nilakkal base camp (16 km away). Direct KSRTC transit buses to Pamba.",
      timings: "Open only during Mandala Pooja (Nov-Dec), Makaravilakku (Jan), and first 5 days of Malayalam months.",
      specialSevas: ["Padi Pooja", "Neyyabhishekam"],
      nearbyHotels: [
        { name: "Abad Whispering Palms Kumarakom", rating: 4.4, distance: "80 km (base town)" }
      ],
      nearbyRestaurants: [
        { name: "Pamba Food Court", rating: 4.0, distance: "5 km trek start" }
      ]
    }
  ];

  try {
    await Temple.deleteMany({});
    const createdTemples = await Temple.insertMany(seedTemples);
    res.status(201).json({ message: "Temples seeded successfully with rich specification details!", createdTemples });
  } catch (err) {
    console.error('Seeding Error:', err.message);
    res.status(500).send('Database seeding processing failed.');
  }
});

module.exports = router;