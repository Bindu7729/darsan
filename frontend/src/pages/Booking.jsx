import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Clock, UserPlus, Trash2, ShieldCheck, CheckCircle2, Loader2, Sparkles, Download, ArrowRight, QrCode } from 'lucide-react';
import Footer from '../components/Footer';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const queryTempleId = searchParams.get('templeId');

  const [currentStep, setCurrentStep] = useState(1); 
  const [temples, setTemples] = useState([]);
  const [selectedTempleId, setSelectedTempleId] = useState('');
  const [selectedDate, setSelectedDate] = useState('Mon, Jul 6');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [ticketType, setTicketType] = useState('regular'); 
  const [devotees, setDevotees] = useState([{ name: '', age: '', idType: 'Aadhaar', idNumber: '' }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Pull temples from database
  useEffect(() => {
    api.get('/temples')
      .then(res => {
        setTemples(res.data);
        if (res.data.length > 0) {
          // Default to URL param or fallback to first temple
          setSelectedTempleId(queryTempleId || res.data[0]._id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed fetching temples:", err);
        setLoading(false);
      });
  }, [queryTempleId]);

  const activeTemple = temples.find(t => t._id === selectedTempleId);

  // Date picker layout tokens
  const dateOptions = [
    { day: 'Mon, Jul 6', slots: '45 Slots', alert: false },
    { day: 'Tue, Jul 7', slots: '12 Slots', alert: true }, 
    { day: 'Wed, Jul 8', slots: '80 Slots', alert: false }
  ];

  const slotsOptions = [
    { id: 'm1', session: 'Morning Slot A', time: '06:00 AM - 09:00 AM' },
    { id: 'm2', session: 'Morning Slot B', time: '09:00 AM - 12:00 PM' },
    { id: 'e1', session: 'Evening Slot A', time: '04:00 PM - 07:00 PM' }
  ];

  const handleAddDevotee = () => setDevotees([...devotees, { name: '', age: '', idType: 'Aadhaar', idNumber: '' }]);
  const handleRemoveDevotee = (index) => {
    const list = [...devotees];
    list.splice(index, 1);
    setDevotees(list);
  };
  
  const handleInputChange = (index, event, field) => {
    const newDevotees = [...devotees];
    newDevotees[index][field] = event.target.value;
    setDevotees(newDevotees);
  };

  // Pricing calculations
  const basePrice = activeTemple ? (ticketType === 'vip' ? activeTemple.ticketPrices.vip : activeTemple.ticketPrices.regular) : 100;
  const totalBasePrice = basePrice * devotees.length;
  const convenienceFee = 50;
  const finalTotal = totalBasePrice + convenienceFee;

  // Form validations for Step 2
  const isDevoteeFormValid = () => {
    return devotees.every(d => d.name.trim() !== '' && d.age !== '' && d.idNumber.trim() !== '');
  };

  // Submit checkout
  const handleFinalCheckout = async () => {
    setSubmitting(true);
    const timeSlotString = slotsOptions.find(s => s.id === selectedSlot)?.time || '06:00 AM - 09:00 AM';
    
    const billingPayload = {
      templeId: selectedTempleId,
      reportingDate: selectedDate,
      timeSlot: timeSlotString,
      ticketType,
      devotees: devotees.map(d => ({ ...d, age: Number(d.age) })),
      payableSum: finalTotal
    };

    try {
      const response = await api.post('/bookings', billingPayload);
      setCreatedBooking(response.data.booking);
      setCurrentStep(4); // Move to Success Page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking pipeline encountered a processing error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-2">
      <Loader2 className="animate-spin text-brand-gold" size={32} />
      <p className="text-xs text-brand-textSecondary font-semibold">Syncing booking data fields...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto px-6 py-10">
        
        {currentStep === 4 && createdBooking ? (
          /* SUCCESS VIEW */
          <div className="max-w-2xl mx-auto bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle shadow-soft-lg p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-green-50 text-brand-success border border-green-200 rounded-full flex items-center justify-center mx-auto shadow-soft-sm">
              <CheckCircle2 size={36} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-brand-textPrimary font-section">Darshan Confirmed Successfully!</h2>
              <p className="text-xs text-brand-textSecondary">Your digital boarding pass has been compiled and secured. A copy has been dispatched to your email.</p>
            </div>

            {/* Boarding Pass details */}
            <div className="bg-brand-bgBase border border-brand-borderSubtle rounded-2xl p-6 text-left space-y-4 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-grow space-y-3 w-full">
                <div>
                  <span className="text-[9px] font-bold text-brand-gold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">Confirmed Entry</span>
                  <h4 className="text-lg font-bold text-brand-textPrimary font-section mt-1">{activeTemple?.name}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Reporting Date</span>
                    <strong className="text-brand-textPrimary">{createdBooking.reportingDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Time Slot</span>
                    <strong className="text-brand-textPrimary">{createdBooking.timeSlot}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Devotees</span>
                    <strong className="text-brand-textPrimary">{createdBooking.devotees.length} Person(s)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-textSecondary uppercase tracking-wider block">Pass Category</span>
                    <strong className="text-brand-gold uppercase">{createdBooking.ticketType}</strong>
                  </div>
                </div>

                <div className="border-t border-brand-borderSubtle/50 pt-2 text-[11px] text-brand-textSecondary">
                  Reference ID: <strong className="font-mono text-brand-textPrimary">{createdBooking.bookingId}</strong>
                </div>
              </div>

              <div className="w-full sm:w-40 border-t sm:border-t-0 sm:border-l border-brand-borderSubtle/50 pt-4 sm:pt-0 sm:pl-6 flex flex-col items-center justify-center shrink-0">
                <div className="p-2 bg-white rounded-lg border border-brand-borderSubtle shadow-soft-sm">
                  <QrCode size={100} className="text-brand-textPrimary" />
                </div>
                <span className="text-[9px] text-brand-textSecondary uppercase tracking-wider mt-2 font-semibold">Scan at Entry Gate</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-2">
              <Link to="/dashboard" className="px-6 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm">Go To Dashboard</Link>
              <button onClick={() => window.print()} className="px-6 py-2.5 bg-white border border-brand-borderSubtle text-brand-textPrimary hover:bg-brand-bgBase text-xs font-bold uppercase rounded-lg">Print Pass</button>
            </div>
          </div>
        ) : (
          /* PROGRESSIVE STEP WIZARD */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* WIZARD LEFT: INPUT FIELDS */}
            <div className="lg:col-span-2 bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-md space-y-8">
              
              {/* Steps Progress Indicator */}
              <div className="flex items-center justify-between pb-6 border-b border-brand-borderSubtle">
                {[
                  { step: 1, name: 'Date & Slot' },
                  { step: 2, name: 'Devotee Info' },
                  { step: 3, name: 'Verify' }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      currentStep === s.step ? 'border-brand-gold text-brand-gold bg-amber-50/50' : currentStep > s.step ? 'border-brand-success bg-brand-success text-white' : 'border-brand-textSecondary text-brand-textSecondary'
                    }`}>
                      {currentStep > s.step ? <CheckCircle2 size={16} /> : s.step}
                    </div>
                    <span className={`text-xs md:text-sm ${currentStep === s.step ? 'text-brand-textPrimary font-bold' : 'text-brand-textSecondary'}`}>{s.name}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: DATE & SLOT SELECTION */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Select Temple Destination */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Target Temple Destination</label>
                    <select 
                      className="w-full bg-brand-bgBase p-3 border border-brand-borderSubtle rounded-xl focus:border-brand-gold focus:outline-none text-xs text-brand-textPrimary font-semibold"
                      value={selectedTempleId}
                      onChange={(e) => setSelectedTempleId(e.target.value)}
                    >
                      {temples.map(t => <option key={t._id} value={t._id}>{t.name} — {t.location}</option>)}
                    </select>
                  </div>

                  {/* Select Date */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Select Date</label>
                    <div className="grid grid-cols-3 gap-3">
                      {dateOptions.map(opt => (
                        <button 
                          key={opt.day} 
                          type="button"
                          onClick={() => setSelectedDate(opt.day)} 
                          className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                            selectedDate === opt.day 
                              ? 'border-brand-gold bg-amber-50/40 text-brand-gold font-bold shadow-soft-sm' 
                              : 'border-brand-borderSubtle bg-brand-bgBase text-brand-textSecondary hover:bg-brand-borderSubtle'
                          }`}
                        >
                          <span className="block font-bold">{opt.day}</span>
                          <span className={`text-[9px] block mt-0.5 ${opt.alert ? 'text-brand-warning font-bold' : 'text-brand-success'}`}>{opt.slots}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Ticket Tier */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Pass Tier Category</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button" 
                        onClick={() => setTicketType('regular')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          ticketType === 'regular' 
                            ? 'border-brand-gold bg-amber-50/40 shadow-soft-sm' 
                            : 'border-brand-borderSubtle bg-brand-bgBase'
                        }`}
                      >
                        <p className="text-xs font-bold text-brand-textPrimary">🙏 Regular Pass</p>
                        <span className="text-[10px] text-brand-textSecondary block mt-1">General queue access. Standard timings.</span>
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={() => setTicketType('vip')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          ticketType === 'vip' 
                            ? 'border-brand-gold bg-amber-50/40 shadow-soft-sm' 
                            : 'border-brand-borderSubtle bg-brand-bgBase'
                        }`}
                      >
                        <p className="text-xs font-bold text-brand-gold">🔱 VIP Access Pass</p>
                        <span className="text-[10px] text-brand-textSecondary block mt-1">Priority queue access. Dedicated VIP gate.</span>
                      </button>
                    </div>
                  </div>

                  {/* Select Time Frame */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Select Time Window</label>
                    <div className="space-y-2">
                      {slotsOptions.map(slot => (
                        <label 
                          key={slot.id} 
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedSlot === slot.id 
                              ? 'border-brand-gold bg-amber-50/30' 
                              : 'border-brand-borderSubtle bg-brand-bgBase hover:bg-brand-bgBase/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="timeslot" 
                              checked={selectedSlot === slot.id} 
                              onChange={() => setSelectedSlot(slot.id)} 
                              className="accent-brand-gold" 
                            />
                            <div>
                              <span className="text-xs font-bold text-brand-textPrimary block">{slot.session}</span>
                              <span className="text-[10px] text-brand-textSecondary">{slot.time}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={!selectedSlot} 
                    onClick={() => setCurrentStep(2)} 
                    className="px-6 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ml-auto block transition-all"
                  >
                    Continue Journey
                  </button>
                </div>
              )}

              {/* STEP 2: DEVOTEE INFO */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-brand-textPrimary font-section">Enter Devotee Registration Profile Details</h3>
                  
                  {devotees.map((devotee, index) => (
                    <div key={index} className="p-4 rounded-xl border border-brand-borderSubtle bg-brand-bgBase space-y-3 relative">
                      <div className="flex justify-between items-center border-b border-brand-borderSubtle/50 pb-2">
                        <span className="text-[10px] font-bold uppercase text-brand-gold">Traveler Devotee #{index + 1}</span>
                        {devotees.length > 1 && (
                          <button onClick={() => handleRemoveDevotee(index)} className="text-brand-error hover:scale-105 transition-transform">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-brand-textSecondary uppercase">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="Name as in ID" 
                            value={devotee.name} 
                            onChange={(e) => handleInputChange(index, e, 'name')} 
                            className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white text-xs outline-none focus:border-brand-gold"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-brand-textSecondary uppercase">Age</label>
                          <input 
                            type="number" 
                            placeholder="Age" 
                            value={devotee.age} 
                            onChange={(e) => handleInputChange(index, e, 'age')} 
                            className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white text-xs outline-none focus:border-brand-gold"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-brand-textSecondary uppercase">Govt ID Number</label>
                          <input 
                            type="text" 
                            placeholder="Aadhaar / Passport Num" 
                            value={devotee.idNumber} 
                            onChange={(e) => handleInputChange(index, e, 'idNumber')} 
                            className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white text-xs outline-none focus:border-brand-gold"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddDevotee} 
                    className="text-xs font-bold text-brand-gold flex items-center gap-1 hover:text-brand-hover"
                  >
                    <UserPlus size={14} /> Add Co-Traveler Devotee
                  </button>

                  <div className="flex justify-between items-center border-t border-brand-borderSubtle/50 pt-4 mt-6">
                    <button onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-brand-textSecondary hover:underline">Back</button>
                    <button 
                      disabled={!isDevoteeFormValid()}
                      onClick={() => setCurrentStep(3)} 
                      className="px-6 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                    >
                      Verify Parameters
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FINAL REVIEW */}
              {currentStep === 3 && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-12 h-12 bg-amber-50 text-brand-gold border border-amber-200 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-section text-brand-textPrimary">Complete Verification Checkout</h3>
                    <p className="text-xs text-brand-textSecondary max-w-sm mx-auto leading-relaxed">By committing, you verify that all devotee details matches original government photo IDs. Deductions are final.</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-brand-borderSubtle/50 pt-4 mt-6">
                    <button onClick={() => setCurrentStep(2)} className="text-xs font-semibold text-brand-textSecondary hover:underline">Back</button>
                    <button 
                      onClick={handleFinalCheckout} 
                      disabled={submitting} 
                      className="px-8 py-3 bg-brand-success hover:bg-green-800 text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm flex items-center gap-2 mx-auto disabled:bg-slate-200"
                    >
                      {submitting ? 'Encrypting Connection...' : 'Confirm & Generate Pass'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* WIZARD RIGHT: BILLING NODE */}
            <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm sticky top-24 space-y-6">
              <h3 className="font-bold text-brand-textPrimary uppercase tracking-wider text-xs border-b border-brand-borderSubtle pb-2">Live Billing Summary</h3>
              
              <div className="space-y-3 text-xs text-brand-textSecondary">
                <div className="flex justify-between"><span>Selected Shrine:</span><span className="font-bold text-brand-textPrimary">{activeTemple?.name || 'Loading...'}</span></div>
                <div className="flex justify-between"><span>Reporting Date:</span><span className="font-semibold text-brand-textPrimary">{selectedDate}</span></div>
                <div className="flex justify-between"><span>Travelers Count:</span><span className="font-semibold text-brand-textPrimary">{devotees.length} Head(s)</span></div>
                <div className="flex justify-between"><span>Base Rate ({ticketType}):</span><span className="font-semibold text-brand-textPrimary">INR {basePrice}.00</span></div>
                <div className="flex justify-between"><span>Infrastructure Fee:</span><span className="font-semibold text-brand-textPrimary">INR 50.00</span></div>
              </div>

              <div className="flex justify-between items-baseline border-t border-brand-borderSubtle/50 pt-4 mt-4">
                <span className="font-bold text-brand-textPrimary text-xs">Gross Payable:</span>
                <span className="text-xl font-bold text-brand-gold font-display">INR {finalTotal}.00</span>
              </div>

              <div className="bg-green-50 text-brand-success p-3 rounded-xl border border-green-100 flex gap-2 items-start text-[11px]">
                <ShieldCheck size={16} className="shrink-0 mt-0.5 text-brand-success" />
                <span>All transactions route transparently directly to designated temple trust registries.</span>
              </div>
            </div>

          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}