import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Landmark, ShieldCheck, Users, Ban, Eye, RefreshCw, BarChart3, DollarSign, Calendar, PlusCircle, Trash2, X, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';

export default function AdminDash() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New temple form states
  const [showAddTemple, setShowAddTemple] = useState(false);
  const [newTempleName, setNewTempleName] = useState('');
  const [newTempleDeity, setNewTempleDeity] = useState('');
  const [newTempleLocation, setNewTempleLocation] = useState('');
  const [newTempleState, setNewTempleState] = useState('');
  const [newTempleImage, setNewTempleImage] = useState('');
  const [newTempleDesc, setNewTempleDesc] = useState('');
  const [newTempleRegularPrice, setNewTempleRegularPrice] = useState(100);
  const [newTempleVipPrice, setNewTempleVipPrice] = useState(500);

  const fetchData = async () => {
    try {
      const bookingsRes = await api.get('/bookings');
      setBookings(bookingsRes.data);

      const usersRes = await api.get('/auth/users');
      setUsers(usersRes.data);

      const templesRes = await api.get('/temples');
      setTemples(templesRes.data);

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Admin Dash Load Error:", err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/auth/users/${userId}/role`, { role: newRole });
      alert(response.data.message);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update user role.");
    }
  };

  const handleDeleteTemple = async (templeId) => {
    if (!window.confirm("Are you sure you want to delete this temple? All associated bookings and reviews will be removed.")) return;
    try {
      await api.delete(`/temples/${templeId}`);
      alert("Temple removed from registry successfully.");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete temple.");
    }
  };

  const handleAddTempleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newTempleName,
        deity: newTempleDeity,
        location: newTempleLocation,
        state: newTempleState,
        imageUrl: newTempleImage || "https://images.unsplash.com/photo-1626621340536-641b9b6343ba?auto=format&fit=crop&q=80&w=600",
        description: newTempleDesc,
        ticketPrices: {
          regular: Number(newTempleRegularPrice),
          vip: Number(newTempleVipPrice)
        }
      };

      await api.post('/temples', payload);
      alert("Temple added to the registry successfully!");
      setShowAddTemple(false);
      // Reset form
      setNewTempleName('');
      setNewTempleDeity('');
      setNewTempleLocation('');
      setNewTempleState('');
      setNewTempleImage('');
      setNewTempleDesc('');
      setNewTempleRegularPrice(100);
      setNewTempleVipPrice(500);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to add new temple to registry.");
    }
  };

  // Stats aggregation
  const totalRevenue = bookings.filter(b => b.status !== 'Cancelled').reduce((acc, curr) => acc + curr.payableSum, 0);
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn').length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-3">
      <Loader2 className="animate-spin text-brand-gold" size={32} />
      <p className="text-xs text-brand-textSecondary font-semibold">Loading system telemetry database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Admin Title Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-brand-borderSubtle pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Root Superuser Terminal Mode
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-textPrimary font-section mt-2">
              System Operations Control Center
            </h2>
            <p className="text-xs text-brand-textSecondary">
              Audit system performance, manage user roles, delete/add temple records, and track financial registers.
            </p>
          </div>
          
          <div className="flex gap-2 self-start sm:self-center">
            <button 
              onClick={() => setShowAddTemple(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-gold hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-soft-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle size={14} /> Add Temple
            </button>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-brand-borderSubtle text-brand-textPrimary hover:bg-brand-bgBase rounded-xl text-xs font-semibold shadow-soft-sm transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </div>

        {/* Global Statistics widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex items-center justify-between interactive-card">
            <div className="space-y-1">
              <p className="text-[10px] text-brand-textSecondary uppercase font-medium tracking-wider">Total System Revenue</p>
              <p className="text-2xl font-bold text-brand-textPrimary font-display">INR {totalRevenue}.00</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-brand-success flex items-center justify-center shrink-0">
              <DollarSign size={18} />
            </div>
          </div>

          <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex items-center justify-between interactive-card">
            <div className="space-y-1">
              <p className="text-[10px] text-brand-textSecondary uppercase font-medium tracking-wider">Registered Devotees</p>
              <p className="text-2xl font-bold text-brand-textPrimary font-display">{users.length} Users</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-brand-gold flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
          </div>

          <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm flex items-center justify-between interactive-card">
            <div className="space-y-1">
              <p className="text-[10px] text-brand-textSecondary uppercase font-medium tracking-wider">Onboarded Shrines</p>
              <p className="text-2xl font-bold text-brand-textPrimary font-display">{temples.length} Sites</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Landmark size={18} />
            </div>
          </div>
        </div>

        {/* Dynamic Data Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* USER MANAGEMENT SECTION */}
          <div className="bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle shadow-soft-sm overflow-hidden flex flex-col justify-between min-h-[350px]">
            <div className="p-5 border-b border-brand-borderSubtle bg-[#FAFAFA]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textPrimary flex items-center gap-2">
                <Users size={16} className="text-brand-gold" /> System User Directory & Roles
              </h3>
            </div>
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-brand-borderSubtle text-brand-textSecondary tracking-wide uppercase font-semibold">
                    <th className="p-4">Devotee Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4 text-center">Modify Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-borderSubtle text-brand-textPrimary">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-brand-bgBase/30 transition-colors">
                      <td className="p-4 font-semibold">{u.name}</td>
                      <td className="p-4 text-brand-textSecondary font-mono">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          u.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-200' :
                          u.role === 'organizer' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-brand-success border border-green-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select 
                          className="p-1 border border-brand-borderSubtle bg-brand-bgBase rounded text-[10px] font-semibold outline-none focus:border-brand-gold"
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                        >
                          <option value="devotee">Devotee</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TEMPLE DATABASE REGISTRY */}
          <div className="bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle shadow-soft-sm overflow-hidden flex flex-col justify-between min-h-[350px]">
            <div className="p-5 border-b border-brand-borderSubtle bg-[#FAFAFA]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textPrimary flex items-center gap-2">
                <Landmark size={16} className="text-brand-gold" /> Onboarded Temples Registry
              </h3>
            </div>
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-brand-borderSubtle text-brand-textSecondary tracking-wide uppercase font-semibold">
                    <th className="p-4">Shrine</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-borderSubtle text-brand-textPrimary">
                  {temples.map((t) => (
                    <tr key={t._id} className="hover:bg-brand-bgBase/30 transition-colors">
                      <td className="p-4 font-semibold">{t.name}</td>
                      <td className="p-4 text-brand-textSecondary">{t.location}</td>
                      <td className="p-4 text-brand-textPrimary font-bold">★ {t.rating}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteTemple(t._id)}
                          className="p-1.5 border border-brand-borderSubtle text-brand-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* BOOKING TRANSACTIONS LIST */}
        <div className="bg-brand-bgSurface rounded-2xl border border-brand-borderSubtle shadow-soft-sm overflow-hidden">
          <div className="p-5 border-b border-brand-borderSubtle bg-[#FAFAFA]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textPrimary flex items-center gap-2">
              <Calendar size={16} className="text-brand-gold" /> System-Wide Booking Ledger
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-brand-borderSubtle text-brand-textSecondary tracking-wide uppercase font-semibold">
                  <th className="p-4">Ref Key</th>
                  <th className="p-4">Shrine</th>
                  <th className="p-4">Reporting Details</th>
                  <th className="p-4 text-right">Sum paid</th>
                  <th className="p-4 text-center">Check-In Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderSubtle text-brand-textPrimary">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-brand-bgBase/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-gold">{b.bookingId}</td>
                    <td className="p-4 font-semibold">{b.temple?.name || 'Vedic Shrine'}</td>
                    <td className="p-4 text-brand-textSecondary">{b.reportingDate} @ {b.timeSlot} ({b.devotees.length} Devotees)</td>
                    <td className="p-4 text-right font-bold text-brand-success">INR {b.payableSum}.00</td>
                    <td className="p-4 text-center">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        b.status === 'Cancelled' ? 'bg-red-50 text-brand-error' :
                        b.status === 'CheckedIn' ? 'bg-green-50 text-brand-success' : 'bg-amber-50 text-brand-gold'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* POPUP MODAL: ADD TEMPLE FORM */}
      {showAddTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-xl w-full bg-brand-bgSurface border border-brand-borderSubtle rounded-2xl shadow-soft-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-brand-borderSubtle/50 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-textPrimary flex items-center gap-1"><Landmark size={16} /> Register New Holy Shrine</h3>
              <button onClick={() => setShowAddTemple(false)} className="p-1 rounded-full hover:bg-brand-bgBase text-brand-textSecondary"><X size={16} /></button>
            </div>

            <form onSubmit={handleAddTempleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Temple Name</label>
                  <input type="text" value={newTempleName} onChange={(e) => setNewTempleName(e.target.value)} placeholder="e.g. Somnath Mandir" className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Primary Presiding Deity</label>
                  <input type="text" value={newTempleDeity} onChange={(e) => setNewTempleDeity(e.target.value)} placeholder="e.g. Lord Shiva" className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Location (Town/City)</label>
                  <input type="text" value={newTempleLocation} onChange={(e) => setNewTempleLocation(e.target.value)} placeholder="e.g. Prabhas Patan" className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">State</label>
                  <input type="text" value={newTempleState} onChange={(e) => setNewTempleState(e.target.value)} placeholder="e.g. Gujarat" className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Banner Image URL</label>
                <input type="text" value={newTempleImage} onChange={(e) => setNewTempleImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Overview Description</label>
                <textarea rows="3" value={newTempleDesc} onChange={(e) => setNewTempleDesc(e.target.value)} placeholder="Describe the temple sanctity, highlights, guidelines..." className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold resize-none" required></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Regular Price (INR)</label>
                  <input type="number" value={newTempleRegularPrice} onChange={(e) => setNewTempleRegularPrice(e.target.value)} className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">VIP Price (INR)</label>
                  <input type="number" value={newTempleVipPrice} onChange={(e) => setNewTempleVipPrice(e.target.value)} className="w-full p-2 border border-brand-borderSubtle rounded-lg bg-white outline-none focus:border-brand-gold" required />
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button type="button" onClick={() => setShowAddTemple(false)} className="px-4 py-2 border border-brand-borderSubtle hover:bg-brand-bgBase rounded-lg font-semibold uppercase tracking-wider text-[10px]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-gold hover:bg-brand-hover text-white rounded-lg font-bold uppercase tracking-wider text-[10px]">Register Shrine</button>
              </div>

            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}