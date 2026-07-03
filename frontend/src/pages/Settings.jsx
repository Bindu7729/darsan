import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';
import Footer from '../components/Footer';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('darshanease_user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert("Settings profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-8">
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">Configure Node</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-textPrimary font-section mt-2">Account Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Navigation Links for settings pages */}
          <div className="bg-brand-bgSurface border border-brand-borderSubtle rounded-2xl p-4 space-y-2 text-xs font-semibold text-brand-textSecondary shadow-soft-sm">
            <button className="w-full text-left py-2 px-3 bg-amber-50 text-brand-gold rounded-lg flex items-center gap-2"><User size={14} /> Devotee Profile</button>
            <button className="w-full text-left py-2 px-3 hover:bg-brand-bgBase rounded-lg flex items-center gap-2"><Bell size={14} /> Notifications</button>
            <button className="w-full text-left py-2 px-3 hover:bg-brand-bgBase rounded-lg flex items-center gap-2"><Shield size={14} /> Security</button>
          </div>

          {/* Settings Fields Column */}
          <form onSubmit={handleSaveSettings} className="md:col-span-2 bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-md space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-textPrimary border-b border-brand-borderSubtle pb-2">Devotee Profile Data</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Display Name</label>
                  <input type="text" className="w-full p-2.5 border border-brand-borderSubtle bg-brand-bgBase rounded-lg font-semibold text-brand-textPrimary outline-none focus:border-brand-gold" defaultValue={user?.name || ''} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Email Address</label>
                  <input type="email" className="w-full p-2.5 border border-brand-borderSubtle bg-slate-100 rounded-lg text-slate-400 outline-none cursor-not-allowed" defaultValue={user?.email || ''} readOnly />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-textPrimary border-b border-brand-borderSubtle pb-2">Notification System Channel Preferences</h3>
              
              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifsEnabled} onChange={() => setNotifsEnabled(!notifsEnabled)} className="accent-brand-gold w-4 h-4" />
                  <div>
                    <span className="font-bold text-brand-textPrimary block">Email alerts & vouchers</span>
                    <span className="text-[10px] text-brand-textSecondary">Dispatches boarding ticket PDFs to your email inbox immediately upon booking checkout.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={smsEnabled} onChange={() => setSmsEnabled(!smsEnabled)} className="accent-brand-gold w-4 h-4" />
                  <div>
                    <span className="font-bold text-brand-textPrimary block">SMS gate check-in alerts</span>
                    <span className="text-[10px] text-brand-textSecondary">Receives a confirmation SMS when your QR pass is successfully scanned at the temple gates.</span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm transition-all transform hover:-translate-y-0.5 ml-auto block">Save Profile Configurations</button>

          </form>

        </div>

      </div>
      <Footer />
    </div>
  );
}
