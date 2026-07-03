import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { QrCode, Download, Calendar, Users, Award, Landmark, TrendingUp, RefreshCw, XCircle, ShieldCheck, Flame, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('darshanease_user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
    fetchMyBookings();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyBookings();
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking? Slots will be released back to the temple inventory.")) return;

    try {
      await api.put(`/bookings/${id}/cancel`);
      alert("Booking cancelled successfully!");
      fetchMyBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  // Stats calculation
  const confirmedBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn').length;
  const totalSpend = bookings.filter(b => b.status !== 'Cancelled').reduce((acc, curr) => acc + curr.payableSum, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-3">
      <Loader2 className="animate-spin text-brand-gold" size={32} />
      <p className="text-xs text-brand-textSecondary font-semibold">Loading your devotee ledger...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Dashboard Welcome Header */}
        <div className="bg-gradient-to-r from-[#FFFBEB] via-white to-[#FDFBF7] p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Devotee Access Node</span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-textPrimary font-section">
              Namaste, {user?.name || 'Devotee'}
            </h2>
            <p className="text-xs text-brand-textSecondary">
              Review your upcoming boarding passes, check-in statuses, and direct temple payments.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleRefresh}
              className="p-2.5 bg-white border border-brand-borderSubtle hover:bg-brand-bgBase rounded-xl text-brand-textPrimary shadow-soft-sm transition-all"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
            <Link 
              to="/booking"
              className="px-5 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-soft-sm transition-all transform hover:-translate-y-0.5"
            >
              Book New Pass
            </Link>
          </div>
        </div>

        {/* Dynamic Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Pane */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active passes */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Active Entry Passes</h3>
              
              {bookings.length === 0 ? (
                <div className="bg-brand-bgSurface p-8 border border-brand-borderSubtle rounded-2xl text-center space-y-4 shadow-soft-sm">
                  <Calendar size={36} className="mx-auto text-slate-300" />
                  <h4 className="text-sm font-bold text-brand-textPrimary">No Booked Passes Found</h4>
                  <p className="text-xs text-brand-textSecondary max-w-xs mx-auto">You don't have any upcoming temple pilgrimages scheduled. Ready to search divine sites?</p>
                  <Link to="/explore" className="inline-block px-4 py-2 bg-brand-gold text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm">Search Shrines</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div 
                      key={booking._id} 
                      className="bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col sm:flex-row relative"
                    >
                      {/* Left color bar */}
                      <div className={`w-2 shrink-0 ${booking.status === 'Cancelled' ? 'bg-brand-error' : booking.status === 'CheckedIn' ? 'bg-brand-success' : 'bg-brand-gold'}`}></div>
                      
                      <div className="p-6 flex-grow space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                              booking.status === 'Cancelled' ? 'bg-red-50 text-brand-error border-red-200' :
                              booking.status === 'CheckedIn' ? 'bg-green-50 text-brand-success border-green-200' : 'bg-amber-50 text-brand-gold border-amber-200'
                            }`}>
                              {booking.status}
                            </span>
                            <h4 className="text-lg font-bold text-brand-textPrimary font-section mt-2">{booking.temple?.name}</h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                          <div>
                            <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Reporting Date</span>
                            <strong className="text-brand-textPrimary">{booking.reportingDate}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Time Slot</span>
                            <strong className="text-brand-textPrimary">{booking.timeSlot}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Travelers</span>
                            <strong className="text-brand-textPrimary">{booking.devotees.length} Head(s)</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Payment Total</span>
                            <strong className="text-brand-textPrimary">INR {booking.payableSum}.00</strong>
                          </div>
                        </div>

                        {/* Devotees sub roster */}
                        <div className="bg-brand-bgBase/70 border border-brand-borderSubtle p-2.5 rounded-lg">
                          <p className="text-[9px] uppercase font-bold text-brand-textSecondary mb-1.5">Registered Devotees List</p>
                          <div className="flex flex-wrap gap-2 text-[10px] text-brand-textPrimary">
                            {booking.devotees.map((d, idx) => (
                              <span key={idx} className="bg-white px-2 py-1 rounded border border-brand-borderSubtle">
                                🙏 {d.name} ({d.age}) - {d.idType}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 text-[11px] text-brand-textSecondary border-t border-dashed border-brand-borderSubtle flex justify-between items-center">
                          <span>Ref Key: <strong className="text-brand-textPrimary font-mono">{booking.bookingId}</strong></span>
                          {booking.status === 'Confirmed' && (
                            <button 
                              onClick={() => handleCancelBooking(booking._id)}
                              className="text-brand-error font-bold flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <XCircle size={12} /> Cancel Pass
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Scalloped dot decoration */}
                      <div className="hidden sm:flex flex-col justify-between py-3 -mx-1 z-10">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-brand-bgBase rounded-full border border-brand-borderSubtle" />
                        ))}
                      </div>

                      {/* QR modules on right */}
                      {booking.status !== 'Cancelled' && (
                        <div className="p-6 bg-[#FAFAFA] border-t sm:border-t-0 sm:border-l border-brand-borderSubtle/50 flex flex-col items-center justify-center shrink-0 w-full sm:w-48 text-center">
                          <div className="bg-white p-2.5 rounded-xl border border-brand-borderSubtle shadow-soft-sm">
                            <QrCode size={80} className="text-brand-textPrimary" />
                          </div>
                          <span className="text-[9px] text-brand-textSecondary uppercase tracking-wider mt-3 font-semibold">Check-In Verification</span>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Quick Metrics & Info sidebar */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Devotee Stats Overview</h3>
            
            {/* Widget A */}
            <div className="bg-brand-bgSurface p-5 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-brand-textSecondary uppercase tracking-wider">Scheduled Journeys</p>
                <p className="text-xl font-bold text-brand-textPrimary font-section">{confirmedBookingsCount} Active</p>
              </div>
            </div>

            {/* Widget B */}
            <div className="bg-brand-bgSurface p-5 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 border border-green-200 text-brand-success rounded-full flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-brand-textSecondary uppercase tracking-wider">Gross Contributions</p>
                <p className="text-xl font-bold text-brand-gold font-display">INR {totalSpend}.00</p>
              </div>
            </div>

            {/* Widget C: 80G Notification Box */}
            <div className="bg-brand-bgSurface p-5 rounded-2xl border border-brand-borderSubtle border-l-4 border-l-brand-gold shadow-soft-sm space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                <Award size={14} /> Heritage Guardian Badge
              </div>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                Thank you for supporting historical shrines. Booking charges are routed directly to authorized devosthanam wallets. Print receipts for tax claims.
              </p>
            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}