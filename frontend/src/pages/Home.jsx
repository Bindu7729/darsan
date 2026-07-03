import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, ArrowRight, Flame, Loader2, Landmark, Award, ShieldCheck, Heart, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function Home() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Fetch structural temple records from MongoDB node on layout load
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await api.get('/temples');
        setTemples(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Pipeline Fetch Failure:', err);
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const uniqueStates = [...new Set(temples.map(t => t.state))];

  // Simple input filter matching search query criteria
  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === '' || temple.state === selectedState;
    return matchesSearch && matchesState;
  });

  // Testimonials Mock Dataset
  const testimonials = [
    { name: "Suresh Iyer", location: "Chennai", comment: "DarshanEase made our annual Tirupati pilgrimage completely hassle-free. Booking the VIP slots was secure and took less than 2 minutes!", rating: 5 },
    { name: "Meenakshi Joshi", location: "Pune", comment: "The live wait-time updates and clear dress code instructions on the details page were extremely helpful for our family visit to Kashi.", rating: 5 },
    { name: "Rahul Deshmukh", location: "Mumbai", comment: "Excellent app interface. It feels like booking a high-end flight or hotel while maintaining the spiritual purity. Direct donations are transparent.", rating: 5 }
  ];

  // Upcoming Festivals Mock Dataset
  const festivals = [
    { name: "Maha Shivratri", date: "Feb 15, 2026", description: "Special night-long Abhishekam slots are now open for online bookings.", image: "https://images.unsplash.com/photo-1609137144813-7d88390234a5?auto=format&fit=crop&q=80&w=400" },
    { name: "Ganesh Chaturthi", date: "Sep 18, 2026", description: "Premium pass registration open for major Siddhivinayak Pujas.", image: "https://images.unsplash.com/photo-1567591937965-dbd8e1465ad6?auto=format&fit=crop&q=80&w=400" },
    { name: "Kartik Poornima", date: "Nov 24, 2026", description: "Varanasi Ganga Aarti boat boarding passes available.", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=400" }
  ];

  // Frequently Asked Questions Dataset
  const faqs = [
    { q: "Is the ticket booking direct-to-temple?", a: "Yes. All funds collected are securely routed to the official bank accounts of the respective temple devasthanams. We only charge a small standard convenience fee to manage the technical server infrastructure." },
    { q: "What documents are required for check-in validation?", a: "You need a printout or digital copy of the booking pass with the QR code, along with the original Government-issued ID card (Aadhaar, Passport, or PAN) of all the registered devotees." },
    { q: "How can I get 80G tax exemptions for donations?", a: "Upon making a direct temple donation, a receipt is generated containing the temple trust registration details. You can download this receipt directly from your personal dashboard ledger for tax filings." }
  ];

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        {/* 1. HERO SECTION */}
        <section className="relative pt-20 pb-28 px-6 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7]/30 to-brand-bgBase overflow-hidden border-b border-brand-borderSubtle/50">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#D97706_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-gold uppercase bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-soft-sm">
              <Sparkles size={12} className="animate-spin" /> Premium Sacred Passage System
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-brand-textPrimary font-display tracking-tight leading-tight max-w-5xl mx-auto">
              Experience the Sacred, <span className="text-brand-gold">Simplified</span>
            </h1>
            <p className="text-sm md:text-lg text-brand-textSecondary max-w-3xl mx-auto leading-relaxed">
              Book verified Darshan slots, participate in live digital Sevas, and support ancient heritage temples through secure, direct donation frameworks.
            </p>

            {/* Float Search Widget */}
            <div className="max-w-4xl mx-auto bg-brand-bgSurface p-3 md:p-4 rounded-2xl shadow-soft-lg border border-brand-borderSubtle flex flex-col md:flex-row gap-3 items-center mt-8">
              <div className="w-full flex items-center gap-2 px-3 py-2 border-b md:border-b-0 md:border-r border-brand-borderSubtle">
                <Search className="text-brand-textSecondary shrink-0" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter Temple Name, Deity, or Location..." 
                  className="w-full bg-transparent border-none outline-none text-xs text-brand-textPrimary placeholder:text-brand-textSecondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="w-full md:w-64 flex items-center gap-2 px-3 py-2">
                <MapPin className="text-brand-textSecondary shrink-0" size={18} />
                <select 
                  className="w-full bg-transparent border-none outline-none text-xs text-brand-textPrimary"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States</option>
                  {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>

              <button className="w-full md:w-auto px-8 py-3 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-soft-sm transition-all shrink-0 cursor-pointer transform hover:-translate-y-0.5">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* 2. POPULAR TEMPLES LISTING SECTION */}
        <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Dynamic Shrines Directory</span>
              <h2 className="text-3xl font-bold text-brand-textPrimary font-section">Popular Pilgrimages</h2>
              <p className="text-xs text-brand-textSecondary">Sourced directly from live audited devosthanam parameters.</p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-hover transition-colors group">
              Explore All <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-brand-gold" size={32} />
              <p className="text-xs text-brand-textSecondary">Connecting with secure temple cluster...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredTemples.slice(0, 3).map((temple) => (
                <div 
                  key={temple._id} 
                  className="bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all interactive-card flex flex-col h-[440px]"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <MapPin size={10} />
                      {temple.state}
                    </div>
                    {temple.isFastFilling && (
                      <div className="absolute top-3 right-3 bg-brand-accent text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                        <Flame size={10} fill="currentColor" /> Fast Filling
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-brand-textPrimary font-section line-clamp-1">
                        {temple.name}
                      </h3>
                      <p className="text-xs text-brand-textSecondary flex items-center gap-1">
                        <MapPin size={12} className="text-brand-textSecondary" /> {temple.location}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-brand-textPrimary font-semibold">
                        <Star size={14} className="text-brand-secondary fill-brand-secondary" />
                        <span>{temple.rating}</span>
                        <span className="text-brand-textSecondary font-normal">({temple.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-borderSubtle/50 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-textSecondary">Ticket Starts:</span>
                        <strong className="text-brand-textPrimary">INR {temple.ticketPrices.regular}.00</strong>
                      </div>

                      <div className="flex gap-2">
                        <Link 
                          to={`/temple/${temple._id}`} 
                          className="w-1/2 py-2 text-center bg-brand-bgBase border border-brand-borderSubtle hover:bg-brand-borderSubtle text-brand-textPrimary font-bold text-xs rounded-lg transition-colors"
                        >
                          View Details
                        </Link>
                        <Link 
                          to="/booking"
                          className="w-1/2 py-2 text-center bg-brand-gold hover:bg-brand-hover text-white font-bold text-xs rounded-lg shadow-soft-sm transition-all"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. APP STATISTICS STRIP PANEL */}
        <section className="bg-brand-textPrimary py-16 px-6 text-white border-y border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-display text-brand-secondary">150,000+</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Bookings Completed</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-display text-brand-secondary">450+</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Audited Shrines Registered</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-display text-brand-secondary">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Direct Trust Bank Routing</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-display text-brand-secondary">80G</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Tax Exemption receipts issued</p>
            </div>
          </div>
        </section>

        {/* 4. UPCOMING FESTIVALS SECTION */}
        <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Auspicious Dates</span>
            <h2 className="text-3xl font-bold text-brand-textPrimary font-section">Upcoming Festivals</h2>
            <p className="text-xs text-brand-textSecondary max-w-xl mx-auto">Book special Darshan passes for key calendar events to avoid heavy physical queues.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {festivals.map((fest, idx) => (
              <div key={idx} className="bg-brand-bgSurface border border-brand-borderSubtle rounded-2xl overflow-hidden shadow-soft-sm flex flex-col h-[380px]">
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img src={fest.image} alt={fest.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-brand-gold text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                    {fest.date}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-brand-textPrimary font-section">{fest.name}</h4>
                    <p className="text-xs text-brand-textSecondary leading-relaxed">{fest.description}</p>
                  </div>
                  <Link to="/explore" className="text-xs font-bold text-brand-gold hover:text-brand-hover inline-flex items-center gap-1 pt-4 border-t border-brand-borderSubtle/50">
                    Find festival slots <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. HOW IT WORKS / APPS FEATURES */}
        <section className="py-20 bg-brand-bgSurface border-y border-brand-borderSubtle px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-brand-gold flex items-center justify-center font-bold text-sm shadow-soft-sm">1</div>
              <h3 className="text-lg font-bold text-brand-textPrimary font-section">Select Auspicious Temple</h3>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                Filter by deity, geographic state, slot timings, and average wait-times. Review facilities, dress codes, and directions on the details page.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-brand-success flex items-center justify-center font-bold text-sm shadow-soft-sm">2</div>
              <h3 className="text-lg font-bold text-brand-textPrimary font-section">Lock-In Booking Details</h3>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                Choose ticket counts, input Government-approved photo IDs, select time slots (Morning/Afternoon/Evening), and confirm checkout.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm shadow-soft-sm">3</div>
              <h3 className="text-lg font-bold text-brand-textPrimary font-section">Scan Pass at Entry Gate</h3>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                Present your secure boarding QR pass to the temple organizer. Check-in validation takes less than 10 seconds for standard entries.
              </p>
            </div>
          </div>
        </section>

        {/* 6. DEVOTEE TESTIMONIALS SECTION */}
        <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Devotee Voice</span>
            <h2 className="text-3xl font-bold text-brand-textPrimary font-section">Devotional Community Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex flex-col justify-between h-[220px]">
                <div className="space-y-3">
                  <div className="flex gap-0.5 text-brand-secondary">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-brand-secondary" />)}
                  </div>
                  <p className="text-xs text-brand-textSecondary leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="flex items-center justify-between border-t border-brand-borderSubtle/50 pt-3 mt-4 text-[11px] text-brand-textSecondary font-semibold">
                  <span>🙏 {t.name}</span>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FAQ COMPACT ACCORDION */}
        <section className="py-20 bg-brand-bgSurface border-t border-brand-borderSubtle px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <HelpCircle className="mx-auto text-brand-gold" size={24} />
              <h2 className="text-3xl font-bold text-brand-textPrimary font-section">Frequently Asked Questions</h2>
              <p className="text-xs text-brand-textSecondary">Key inquiries about booking procedures, refunds, and gate clearances.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-brand-borderSubtle bg-brand-bgBase space-y-2">
                  <h4 className="text-sm font-bold text-brand-textPrimary font-sans">❓ {faq.q}</h4>
                  <p className="text-xs text-brand-textSecondary leading-relaxed pl-5 border-l-2 border-brand-gold">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION SECTION */}
        <section className="py-20 px-6 bg-gradient-to-tr from-[#FFFBEB] via-[#FEF3C7]/40 to-brand-bgBase border-t border-brand-borderSubtle text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-textPrimary font-display max-w-2xl mx-auto">Ready to Embark on Your Next Auspicious Pilgrimage?</h2>
          <p className="text-xs md:text-sm text-brand-textSecondary max-w-md mx-auto">Create a secure profile context to trace check-in boarding passes, lock in VIP slots, and view tax certificates.</p>
          <div className="flex gap-4 justify-center pt-2">
            <Link to="/auth" className="px-6 py-3 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-soft-sm transition-all transform hover:-translate-y-0.5">Access Vault Login</Link>
            <Link to="/explore" className="px-6 py-3 bg-white hover:bg-brand-bgBase border border-brand-borderSubtle text-brand-textPrimary text-xs font-bold uppercase tracking-wider rounded-xl transition-all">Explore Shrines</Link>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}