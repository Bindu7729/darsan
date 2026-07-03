import React from 'react';
import { Landmark, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        {/* About Header */}
        <section className="py-16 bg-gradient-to-b from-[#FFFBEB] to-brand-bgBase border-b border-brand-borderSubtle px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">Our Sacred Mission</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-textPrimary">About DarshanEase</h1>
            <p className="text-xs md:text-sm text-brand-textSecondary leading-relaxed">
              We bridge ancient Indian temple architectures with modern, secure, and intuitive web systems. Our goal is to make pilgrim travel simple and direct temple contributions completely transparent.
            </p>
          </div>
        </section>

        {/* Content Details */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-textPrimary font-section">The Devotional Challenge</h2>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                For decades, devotees have faced hours of wait times, crowded queues, and booking confusion while visiting major Indian shrines. DarshanEase resolves this by implementing a secure, real-time slot booking model.
              </p>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                We believe that spiritual travel should be peaceful, calm, and trustworthy. Our system helps local temple trusts manage their crowd capacity while guaranteeing clear timelines.
              </p>
            </div>
            <div className="bg-brand-bgSurface p-6 rounded-2xl border border-brand-borderSubtle shadow-soft-sm text-center space-y-3">
              <Landmark size={48} className="mx-auto text-brand-gold animate-bounce" />
              <h4 className="font-bold text-brand-textPrimary">Heritage Guardian Network</h4>
              <p className="text-[11px] text-brand-textSecondary">Every booking charge routes directly to designated temple trust bank accounts without intermediary holdouts.</p>
            </div>
          </div>

          <hr className="border-brand-borderSubtle" />

          {/* Pillars of trust */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-brand-textPrimary font-section text-center">Our Core Trust Pillars</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-textSecondary">
              <div className="p-5 bg-brand-bgSurface rounded-xl border border-brand-borderSubtle space-y-2">
                <div className="w-8 h-8 rounded-full bg-green-50 text-brand-success flex items-center justify-center font-bold">1</div>
                <h4 className="font-bold text-brand-textPrimary">Financial Transparency</h4>
                <p>All devotee bookings and direct donations generate detailed, audited bank receipts. Zero commission leakages.</p>
              </div>
              
              <div className="p-5 bg-brand-bgSurface rounded-xl border border-brand-borderSubtle space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center font-bold">2</div>
                <h4 className="font-bold text-brand-textPrimary">Standard Security</h4>
                <p>Devotee credentials and government ID reference numbers are protected by secure database encryption standards.</p>
              </div>
              
              <div className="p-5 bg-brand-bgSurface rounded-xl border border-brand-borderSubtle space-y-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">3</div>
                <h4 className="font-bold text-brand-textPrimary">Crowd Management</h4>
                <p>Live organizer barcode check-in interfaces prevent slot congestion and guarantee immediate gate access.</p>
              </div>
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </div>
  );
}
