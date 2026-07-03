import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Flame, Loader2, Heart, Award, Filter, X } from 'lucide-react';
import Footer from '../components/Footer';

export default function Explore() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from local storage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('darshanease_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Fetch temples
  useEffect(() => {
    api.get('/temples')
      .then(res => {
        setTemples(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Explore Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const toggleWishlist = (id) => {
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(id)) {
      updatedWishlist = updatedWishlist.filter(item => item !== id);
    } else {
      updatedWishlist.push(id);
    }
    setWishlist(updatedWishlist);
    localStorage.setItem('darshanease_wishlist', JSON.stringify(updatedWishlist));
  };

  const uniqueStates = [...new Set(temples.map(t => t.state))];
  const uniqueDeities = [...new Set(temples.map(t => t.deity))];

  // Filtering Logic
  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === '' || temple.state === selectedState;
    const matchesDeity = selectedDeity === '' || temple.deity === selectedDeity;
    return matchesSearch && matchesState && matchesDeity;
  });

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        {/* Explore Heading & Hero Block */}
        <section className="py-12 bg-gradient-to-b from-[#FFFBEB] to-brand-bgBase border-b border-brand-borderSubtle px-6">
          <div className="max-w-7xl mx-auto space-y-4 text-center md:text-left">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">Explore Directory</span>
            <h1 className="text-3xl md:text-4xl font-bold font-section text-brand-textPrimary">Search Divine Destinations</h1>
            <p className="text-xs text-brand-textSecondary max-w-xl">Find verified holy shrines, schedule special puja times, and explore accommodations near ancient Indian pilgrimage sites.</p>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="max-w-7xl mx-auto px-6 pt-10">
          <div className="bg-brand-bgSurface border border-brand-borderSubtle rounded-2xl p-4 shadow-soft-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Search Input */}
            <div className="p-2 bg-brand-bgBase border border-brand-borderSubtle rounded-xl flex items-center gap-2">
              <Search size={16} className="text-brand-textSecondary shrink-0" />
              <input 
                type="text" 
                placeholder="Search name, city..." 
                className="w-full bg-transparent border-none outline-none text-xs text-brand-textPrimary placeholder:text-brand-textSecondary p-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-brand-textSecondary hover:text-brand-textPrimary"><X size={14} /></button>
              )}
            </div>

            {/* State Filter */}
            <div className="p-2 bg-brand-bgBase border border-brand-borderSubtle rounded-xl flex items-center gap-2">
              <Filter size={16} className="text-brand-textSecondary shrink-0" />
              <select
                className="w-full bg-transparent border-none outline-none text-xs text-brand-textPrimary"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>

            {/* Deity Filter */}
            <div className="p-2 bg-brand-bgBase border border-brand-borderSubtle rounded-xl flex items-center gap-2">
              <Award size={16} className="text-brand-textSecondary shrink-0" />
              <select
                className="w-full bg-transparent border-none outline-none text-xs text-brand-textPrimary"
                value={selectedDeity}
                onChange={(e) => setSelectedDeity(e.target.value)}
              >
                <option value="">All Deities</option>
                {uniqueDeities.map(deity => <option key={deity} value={deity}>{deity}</option>)}
              </select>
            </div>

            {/* Clear All Button */}
            <button 
              onClick={() => { setSearchQuery(''); setSelectedState(''); setSelectedDeity(''); }}
              className="py-2.5 bg-brand-bgBase border border-brand-borderSubtle text-brand-textSecondary hover:bg-brand-borderSubtle rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Clear Filters
            </button>

          </div>
        </section>

        {/* Directory Listing Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-brand-gold" size={32} />
              <p className="text-xs text-brand-textSecondary">Syncing temple archives...</p>
            </div>
          ) : filteredTemples.length === 0 ? (
            <div className="text-center py-20 bg-brand-bgSurface border border-brand-borderSubtle rounded-2xl shadow-soft-sm p-8 space-y-4">
              <Landmark size={48} className="mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-brand-textPrimary font-section">No Shrines Match Your Search</h3>
              <p className="text-xs text-brand-textSecondary max-w-sm mx-auto">We couldn't find any temples matching your specific parameters. Check your spellings or clear filter metrics.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedState(''); setSelectedDeity(''); }}
                className="px-5 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredTemples.map((temple) => {
                const isFavorite = wishlist.includes(temple._id);
                return (
                  <div 
                    key={temple._id} 
                    className="bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all interactive-card flex flex-col h-[440px] relative"
                  >
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={() => toggleWishlist(temple._id)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-md border border-brand-borderSubtle text-brand-textSecondary hover:text-brand-accent transition-colors shadow-soft-sm cursor-pointer"
                    >
                      <Heart size={14} className={isFavorite ? "fill-brand-accent text-brand-accent" : ""} />
                    </button>

                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img 
                        src={temple.imageUrl} 
                        alt={temple.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <MapPin size={10} />
                        {temple.state}
                      </div>
                      {temple.isFastFilling && (
                        <div className="absolute top-3 right-16 bg-brand-accent text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                          <Flame size={10} fill="currentColor" /> Fast Filling
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold px-2 py-0.5 bg-amber-50 rounded border border-amber-200">
                          {temple.deity}
                        </span>
                        <h3 className="text-lg font-bold text-brand-textPrimary font-section line-clamp-1 mt-1">
                          {temple.name}
                        </h3>
                        <p className="text-xs text-brand-textSecondary flex items-center gap-1">
                          <MapPin size={12} className="text-brand-textSecondary" /> {temple.location}
                        </p>
                        
                        <div className="flex items-center gap-1 text-xs text-brand-textPrimary font-semibold">
                          <Star size={14} className="text-brand-secondary fill-brand-secondary" />
                          <span>{temple.rating}</span>
                          <span className="text-brand-textSecondary font-normal">({temple.reviewsCount} Reviews)</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-brand-borderSubtle/50 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-brand-textSecondary">Regular Ticket:</span>
                          <strong className="text-brand-textPrimary">INR {temple.ticketPrices.regular}.00</strong>
                        </div>

                        <div className="flex gap-2">
                          <Link 
                            to={`/temple/${temple._id}`} 
                            className="w-1/2 py-2 text-center bg-brand-bgBase border border-brand-borderSubtle hover:bg-brand-borderSubtle text-brand-textPrimary font-bold text-xs rounded-lg transition-colors"
                          >
                            Details
                          </Link>
                          <Link 
                            to={`/booking?templeId=${temple._id}`}
                            className="w-1/2 py-2 text-center bg-brand-gold hover:bg-brand-hover text-white font-bold text-xs rounded-lg shadow-soft-sm transition-all"
                          >
                            Book Darshan
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
      <Footer />
    </div>
  );
}