import React from 'react';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        <section className="py-16 bg-gradient-to-b from-[#FFFBEB] to-brand-bgBase border-b border-brand-borderSubtle px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">Legal Terms</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-textPrimary">Terms of Service</h1>
            <p className="text-xs md:text-sm text-brand-textSecondary">Last Updated: July 03, 2026</p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-xs text-brand-textSecondary leading-relaxed">
          <h2 className="text-lg font-bold text-brand-textPrimary font-section">1. Slot Allocation Rules</h2>
          <p>Tickets booked are valid only for the selected reporting date and time window. Devotees arriving outside their scheduled slots may be refused entry by gate organizers.</p>
          
          <h2 className="text-lg font-bold text-brand-textPrimary font-section">2. Devotee Dress Code Compliance</h2>
          <p>All pilgrim travelers must strictly adhere to the guidelines and dress codes listed on the temple details page. Platform refunds will not be issued for entries rejected due to dress code violations.</p>

          <h2 className="text-lg font-bold text-brand-textPrimary font-section">3. Cancellation Policies</h2>
          <p>Cancellation operations must be executed at least 24 hours prior to the reporting hour. Released slots are immediately refunded to the system directory.</p>

          <h2 className="text-lg font-bold text-brand-textPrimary font-section">4. Disclaimer & Liabilities</h2>
          <p>DarshanEase operates as a booking platform. Physical crowd management, temple closure due to weather or VIP visits, and local pooja delays are managed by the respective devosthanam authorities.</p>
        </section>

      </div>
      <Footer />
    </div>
  );
}
