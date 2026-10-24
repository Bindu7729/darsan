import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { fallbackTemples } from '../utils/fallbackTemples';
import { Star, MapPin, Landmark, Calendar, ShieldCheck, Heart, Coffee, Bed, ArrowLeft, Loader2, MessageSquare, Send, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';

export default function TempleDetails() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const token = localStorage.getItem('darshanease_token');
  const userString = localStorage.getItem('darshanease_user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchTempleData = async () => {
      try {
        setLoading(true);
        const templeRes = await api.get(`/temples/${id}`);
        if (templeRes.data) {
          setTemple(templeRes.data);
        } else {
          const match = fallbackTemples.find(t => t._id === id || t.name.toLowerCase().includes(id.toLowerCase())) || fallbackTemples[0];
          setTemple(match);
        }
        
        try {
          const reviewsRes = await api.get(`/temples/${id}/reviews`);
          setReviews(reviewsRes.data || []);
        } catch {
          setReviews([]);
        }

        // Check if favorite in localstorage
        const savedWishlist = localStorage.getItem('darshanease_wishlist');
        if (savedWishlist) {
          const list = JSON.parse(savedWishlist);
          setIsFavorite(list.includes(id));
        }

        setLoading(false);
      } catch (err) {
        console.warn("Temple details load error, checking offline registry:", err);
        const match = fallbackTemples.find(t => t._id === id || t.name.toLowerCase().includes(id.toLowerCase())) || fallbackTemples[0];
        setTemple(match);
        setReviews([]);
        setLoading(false);
      }
    };
    fetchTempleData();
  }, [id]);

  const toggleFavorite = () => {
    const savedWishlist = localStorage.getItem('darshanease_wishlist');
    let list = savedWishlist ? JSON.parse(savedWishlist) : [];
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
      setIsFavorite(false);
    } else {
      list.push(id);
      setIsFavorite(true);
    }
    localStorage.setItem('darshanease_wishlist', JSON.stringify(list));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const response = await api.post(`/temples/${id}/reviews`, {
        rating: newRating,
        comment: newComment,
        userName: user ? user.name : 'Anonymous Devotee'
      });

      alert(response.data.message);
      
      // Update local reviews list
      const freshReviews = await api.get(`/temples/${id}/reviews`);
      setReviews(freshReviews.data);
      
      // Update temple rating
      setTemple(prev => ({
        ...prev,
        rating: response.data.rating,
        reviewsCount: response.data.reviewsCount
      }));

      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-3">
      <Loader2 className="animate-spin text-brand-gold" size={32} />
      <p className="text-xs text-brand-textSecondary font-semibold">Syncing divine metrics...</p>
    </div>
  );

  if (!temple) return (
    <div className="text-center py-20 bg-brand-bgSurface border border-brand-borderSubtle max-w-lg mx-auto rounded-2xl p-8 space-y-4 my-10">
      <Landmark size={48} className="mx-auto text-slate-300 animate-bounce" />
      <h3 className="text-lg font-bold text-brand-textPrimary font-section">Shrine Profile Missing</h3>
      <p className="text-xs text-brand-textSecondary">We couldn't locate the requested temple registry ID.</p>
      <Link to="/explore" className="inline-block px-5 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm">Return to Search</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        {/* PARALLAX HERO BANNER */}
        <section className="relative h-[320px] md:h-[420px] bg-slate-900 overflow-hidden">
          <img src={temple.imageUrl} alt={temple.name} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>
          
          {/* Floating Actions */}
          <div className="absolute top-6 left-6 right-6 flex justify-between z-10 max-w-7xl mx-auto">
            <Link to="/explore" className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all flex items-center justify-center">
              <ArrowLeft size={16} />
            </Link>
            <button 
              onClick={toggleFavorite}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all flex items-center justify-center cursor-pointer"
            >
              <Heart size={16} className={isFavorite ? "fill-brand-accent text-brand-accent" : ""} />
            </button>
          </div>

          {/* Heading Info */}
          <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto text-white space-y-2 z-10">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-brand-secondary text-brand-textPrimary px-2.5 py-0.5 rounded">
              🙏 {temple.deity}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight leading-tight">{temple.name}</h1>
            <p className="text-xs md:text-sm text-slate-300 flex items-center gap-1">
              <MapPin size={14} className="text-brand-secondary" /> {temple.location}
            </p>
          </div>
        </section>

        {/* CONTAINER GRID */}
        <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: ABOUT, DETAILS, SEVAS, REVIEWS */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview & Description */}
            <div className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
              <h2 className="text-xl font-bold text-brand-textPrimary font-section border-l-4 border-l-brand-gold pl-3">Overview & Sanctity</h2>
              <p className="text-xs md:text-sm text-brand-textSecondary leading-relaxed">{temple.description || 'Detailed description of this sacred site is currently being compiled by the Devosthanam administration.'}</p>
            </div>

            {/* History */}
            {temple.history && (
              <div className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
                <h2 className="text-xl font-bold text-brand-textPrimary font-section border-l-4 border-l-brand-gold pl-3">Historical Importance</h2>
                <p className="text-xs md:text-sm text-brand-textSecondary leading-relaxed">{temple.history}</p>
              </div>
            )}

            {/* Special Sevas & Facilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Facilities */}
              <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
                <h3 className="text-md font-bold text-brand-textPrimary font-section border-l-4 border-l-brand-secondary pl-3">Devotee Facilities</h3>
                <ul className="space-y-2 text-xs text-brand-textSecondary">
                  {temple.facilities && temple.facilities.length > 0 ? (
                    temple.facilities.map((fac, idx) => <li key={idx} className="flex items-center gap-2">🔹 {fac}</li>)
                  ) : (
                    <li>Standard resting halls and drinking water available.</li>
                  )}
                </ul>
              </div>

              {/* Special Sevas */}
              <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
                <h3 className="text-md font-bold text-brand-textPrimary font-section border-l-4 border-l-brand-secondary pl-3">Special Sevas Offered</h3>
                <ul className="space-y-2 text-xs text-brand-textSecondary">
                  {temple.specialSevas && temple.specialSevas.length > 0 ? (
                    temple.specialSevas.map((seva, idx) => <li key={idx} className="flex items-center gap-2">🕉️ {seva}</li>)
                  ) : (
                    <li>General Darshan and Archana sevas are active.</li>
                  )}
                </ul>
              </div>

            </div>

            {/* Travel Guidelines (Dress Code, Parking, Timings) */}
            <div className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-6">
              <h2 className="text-xl font-bold text-brand-textPrimary font-section border-l-4 border-l-brand-gold pl-3">Traveler Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-textPrimary uppercase tracking-wider">👗 Dress Code</h4>
                  <p className="text-brand-textSecondary leading-relaxed">{temple.dressCode}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-textPrimary uppercase tracking-wider">🚗 Parking Access</h4>
                  <p className="text-brand-textSecondary leading-relaxed">{temple.parking}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-textPrimary uppercase tracking-wider">⏰ Darshan Timings</h4>
                  <p className="text-brand-textSecondary leading-relaxed">{temple.timings}</p>
                </div>
              </div>
            </div>

            {/* Nearby Accommodations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotels */}
              <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
                <h3 className="text-md font-bold text-brand-textPrimary font-section flex items-center gap-2">
                  <Bed size={16} className="text-brand-gold" /> Nearby Accommodations
                </h3>
                <div className="space-y-3 text-xs text-brand-textSecondary">
                  {temple.nearbyHotels && temple.nearbyHotels.length > 0 ? (
                    temple.nearbyHotels.map((hot, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-brand-borderSubtle/50 pb-2">
                        <span>🏨 {hot.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-secondary font-semibold">★ {hot.rating}</span>
                          <span className="text-[10px] text-brand-textSecondary">({hot.distance})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>GMVN and local lodges are available within 2km.</p>
                  )}
                </div>
              </div>

              {/* Restaurants */}
              <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
                <h3 className="text-md font-bold text-brand-textPrimary font-section flex items-center gap-2">
                  <Coffee size={16} className="text-brand-gold" /> Dining (Pure Vegetarian)
                </h3>
                <div className="space-y-3 text-xs text-brand-textSecondary">
                  {temple.nearbyRestaurants && temple.nearbyRestaurants.length > 0 ? (
                    temple.nearbyRestaurants.map((res, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-brand-borderSubtle/50 pb-2">
                        <span>🍴 {res.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-secondary font-semibold">★ {res.rating}</span>
                          <span className="text-[10px] text-brand-textSecondary">({res.distance})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Local vegetarian food stands operate nearby.</p>
                  )}
                </div>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-6">
              <h2 className="text-xl font-bold text-brand-textPrimary font-section border-l-4 border-l-brand-gold pl-3">Community Reviews & Ratings</h2>
              
              <div className="flex items-center gap-4 border-b border-brand-borderSubtle/50 pb-6">
                <div className="text-center p-4 bg-brand-bgBase border border-brand-borderSubtle rounded-2xl shrink-0 w-24">
                  <p className="text-3xl font-bold text-brand-textPrimary font-display">{temple.rating}</p>
                  <p className="text-[9px] text-brand-textSecondary uppercase font-medium">Out of 5</p>
                </div>
                <div className="text-xs text-brand-textSecondary">
                  <div className="flex items-center gap-1 mb-1 font-bold text-brand-textPrimary">
                    <Star size={12} className="fill-brand-secondary text-brand-secondary" /> {temple.rating} stars
                  </div>
                  <p>Aggregate calculated from {temple.reviewsCount} verified devotee experiences.</p>
                </div>
              </div>

              {/* Review Input form */}
              {token ? (
                <form onSubmit={handleReviewSubmit} className="p-4 bg-brand-bgBase border border-brand-borderSubtle rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider flex items-center gap-1.5"><MessageSquare size={14} /> Write an Experience Review</h4>
                  <div className="flex gap-4 items-center">
                    <span className="text-xs text-brand-textSecondary">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setNewRating(star)}
                          className="text-brand-secondary hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star size={18} className={newRating >= star ? "fill-brand-secondary" : ""} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center p-2 bg-white border border-brand-borderSubtle rounded-lg">
                    <input 
                      type="text" 
                      placeholder="Share your pilgrimage details (wait time, queues, guidelines)..." 
                      className="w-full bg-transparent border-none outline-none text-xs text-brand-textPrimary p-1"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={submittingReview} className="p-2 bg-brand-gold hover:bg-brand-hover text-white rounded-lg shrink-0 transition-colors">
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-brand-warning flex justify-between items-center">
                  <span>Sign in to write a review of this shrine.</span>
                  <Link to="/auth" className="px-3 py-1 bg-brand-gold text-white font-bold rounded-lg uppercase tracking-wider text-[10px]">Login</Link>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-brand-textSecondary italic text-center py-6">No experience reviews posted for this temple yet. Be the first to share your journey!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-brand-bgBase border border-brand-borderSubtle rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-xs text-brand-textPrimary block">🙏 {rev.userName}</strong>
                          <span className="text-[10px] text-brand-textSecondary">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-0.5 text-brand-secondary">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} className="fill-brand-secondary" />)}
                        </div>
                      </div>
                      <p className="text-xs text-brand-textSecondary leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: BOOKING INFORMATION & SUMMARY */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* Booking Card */}
            <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-md space-y-6">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Immediate Reservation</span>
                <h3 className="text-xl font-bold text-brand-textPrimary font-section mt-1">Schedule Darshan</h3>
              </div>

              <div className="space-y-3 text-xs text-brand-textSecondary">
                <div className="flex justify-between border-b border-brand-borderSubtle/50 pb-2">
                  <span>Remaining Slots Today:</span>
                  <strong className={temple.availableSlotsCount < 15 ? "text-brand-warning" : "text-brand-success"}>
                    {temple.availableSlotsCount} Seats
                  </strong>
                </div>
                <div className="flex justify-between border-b border-brand-borderSubtle/50 pb-2">
                  <span>Regular ticket price:</span>
                  <strong className="text-brand-textPrimary">INR {temple.ticketPrices.regular}.00</strong>
                </div>
                <div className="flex justify-between border-b border-brand-borderSubtle/50 pb-2">
                  <span>VIP ticket price:</span>
                  <strong className="text-brand-textPrimary">INR {temple.ticketPrices.vip}.00</strong>
                </div>
              </div>

              <Link 
                to={`/booking?templeId=${temple._id}`}
                className="w-full py-3 bg-brand-gold hover:bg-brand-hover text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl shadow-soft-sm transition-all block cursor-pointer transform hover:-translate-y-0.5"
              >
                Proceed to Booking Wizard
              </Link>

              <div className="bg-green-50 text-brand-success border border-green-100 p-3 rounded-xl flex gap-1.5 items-start text-[11px]">
                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-brand-success" />
                <span>Instant payment confirmation with secure barcode checkin.</span>
              </div>
            </div>

            {/* Related/Nearby list */}
            <div className="bg-brand-bgSurface p-5 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-4">
              <h4 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider flex items-center gap-1"><Sparkles size={12} className="text-brand-gold" /> Auspicious Pilgrimages</h4>
              <p className="text-[11px] text-brand-textSecondary leading-relaxed">Book slots at India's other leading temples during the same holy season.</p>
              <Link to="/explore" className="inline-block text-[11px] font-bold text-brand-gold hover:underline">Explore dynamic directory &rarr;</Link>
            </div>

          </div>

        </section>

      </div>
      <Footer />
    </div>
  );
}
