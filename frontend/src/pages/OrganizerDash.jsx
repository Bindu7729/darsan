import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Scan, ShieldCheck, ShieldAlert, Users, QrCode, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';

export default function OrganizerDash() {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(1240);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const totalExpectedDevotees = 3000;
  const metricsPercentage = Math.round((checkedInCount / totalExpectedDevotees) * 100);

  const fetchStats = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
      const checkedIn = res.data.filter(b => b.status === 'CheckedIn').length;
      setCheckedInCount(1240 + checkedIn); // Adding mock baseline offset + actual DB checked in
      setLoadingBookings(false);
    } catch (err) {
      console.error(err);
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTicketValidation = async (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    setValidating(true);
    setScanResult(null);

    try {
      const response = await api.put(`/bookings/${scanInput.trim()}/checkin`);
      setScanResult({
        status: 'success',
        message: response.data.message,
        id: scanInput,
        templeName: response.data.booking.temple?.name || 'Vedic Shrine',
        devoteesCount: response.data.booking.devotees?.length || 1,
        tier: response.data.booking.ticketType || 'regular'
      });
      fetchStats(); // Refresh stats
      setScanInput('');
    } catch (err) {
      console.error(err);
      setScanResult({
        status: 'invalid',
        message: err.response?.data?.message || 'Access Denied. Fraudulent or expired security signature key.',
        id: scanInput
      });
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Dashboard Title Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
            Security Gate Terminal Access
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-textPrimary font-section mt-2">
            Temple Organizer Dashboard
          </h2>
          <p className="text-xs text-brand-textSecondary">
            Scan devotee boarding barcodes, audit incoming counts, and verify ticket validity in real-time.
          </p>
        </div>

        {/* Counter Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-bgSurface p-5 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex items-center gap-5">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0 rounded-full border-4 border-brand-gold bg-amber-50">
              <span className="text-xs font-bold text-brand-gold">{metricsPercentage}%</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-brand-textSecondary uppercase tracking-wider font-semibold">Checked-In Capacity Today</p>
              <p className="text-xl font-bold text-brand-textPrimary">{checkedInCount} / {totalExpectedDevotees} Devotees</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Validation form */}
          <div className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-md space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary flex items-center gap-2">
              <Scan size={16} className="text-brand-gold" /> Live Barcode Scanner Roster
            </h3>
            
            <form onSubmit={handleTicketValidation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textSecondary">Ticket Reference Key</label>
                <div className="p-3 bg-brand-bgBase border border-brand-borderSubtle rounded-xl flex gap-3 items-center">
                  <QrCode className="text-brand-textSecondary shrink-0" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter pass key (e.g., DE-KED-2026-1234)" 
                    className="w-full bg-transparent border-none outline-none text-xs p-0.5 font-mono uppercase tracking-wide text-brand-textPrimary"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    disabled={validating}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={validating || !scanInput.trim()} 
                className="w-full py-3.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-soft-sm transition-all"
              >
                {validating ? 'Verifying Credentials...' : 'Authenticate Check-in'}
              </button>
            </form>

            {/* Validation Display Alert */}
            {scanResult && (
              <div className={`p-5 rounded-2xl border flex gap-3 items-start ${
                scanResult.status === 'success' ? 'bg-green-50 border-green-200 text-brand-success' : 'bg-red-50 border-red-200 text-brand-error'
              }`}>
                {scanResult.status === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <ShieldAlert className="shrink-0 mt-0.5" size={18} />}
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-sm leading-none">{scanResult.message}</p>
                  {scanResult.status === 'success' && (
                    <>
                      <p className="text-[10px] opacity-80">Shrine: <strong>{scanResult.templeName}</strong></p>
                      <p className="text-[10px] opacity-80">Devotees: <strong>{scanResult.devoteesCount} Person(s)</strong> | Category: <strong className="uppercase">{scanResult.tier}</strong></p>
                    </>
                  )}
                  <p className="text-[10px] opacity-75 font-mono pt-1">Code: {scanResult.id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Roster Queue log */}
          <div className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-sm space-y-6 h-[340px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Checked-in Log Stream</h3>
            
            {loadingBookings ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin text-brand-gold" size={24} />
              </div>
            ) : bookings.filter(b => b.status === 'CheckedIn').length === 0 ? (
              <p className="text-xs text-brand-textSecondary italic py-6 text-center">No devotees scanned in yet today.</p>
            ) : (
              <div className="space-y-4">
                {bookings.filter(b => b.status === 'CheckedIn').map((booking) => (
                  <div key={booking._id} className="p-3 bg-brand-bgBase rounded-xl border border-brand-borderSubtle flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-brand-textPrimary block">{booking.temple?.name}</strong>
                      <span className="text-[10px] text-brand-textSecondary font-mono">{booking.bookingId}</span>
                    </div>
                    <span className="text-[10px] font-bold text-brand-success uppercase bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">Checked In</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}