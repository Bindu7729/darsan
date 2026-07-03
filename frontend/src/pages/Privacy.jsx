import React from 'react';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        <section className="py-16 bg-gradient-to-b from-[#FFFBEB] to-brand-bgBase border-b border-brand-borderSubtle px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">Legal Terms</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-textPrimary">Privacy Policy</h1>
            <p className="text-xs md:text-sm text-brand-textSecondary">Last Updated: July 03, 2026</p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-xs text-brand-textSecondary leading-relaxed">
          <h2 className="text-lg font-bold text-brand-textPrimary font-section">1. Information Collection</h2>
          <p>We collect personal information such as devotee names, age metrics, government photo ID reference numbers, and contact channels (email and phone number) to successfully complete slot validation procedures at the temple gates.</p>
          
          <h2 className="text-lg font-bold text-brand-textPrimary font-section">2. Data Usage & Encription</h2>
          <p>Devotee data is securely cached inside MongoDB Atlas registers under security tokens. We do not sell or lease user information to third-party marketing services.</p>

          <h2 className="text-lg font-bold text-brand-textPrimary font-section">3. Direct Payment Security</h2>
          <p>Financial payments are handled directly by secure payment gateway integrations (Mock/Stripe portals). Card credentials or bank codes are never stored on our host servers.</p>

          <h2 className="text-lg font-bold text-brand-textPrimary font-section">4. Cookies Usage</h2>
          <p>We use local storage keys and browser cookies to maintain secure active sessions and preserve user favorites list preferences.</p>
        </section>

      </div>
      <Footer />
    </div>
  );
}
