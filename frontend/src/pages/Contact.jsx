import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      alert("Your message has been dispatched to DarshanEase Support team. We will revert within 24 hours.");
      setName('');
      setEmail('');
      setMessage('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        {/* Contact Header */}
        <section className="py-16 bg-gradient-to-b from-[#FFFBEB] to-brand-bgBase border-b border-brand-borderSubtle px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">Contact Support</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-textPrimary">Get In Touch</h1>
            <p className="text-xs md:text-sm text-brand-textSecondary leading-relaxed">
              Have questions regarding ticket bookings, bulk registrations, or temple onboarding? Leave a note.
            </p>
          </div>
        </section>

        {/* Contact Details & Form */}
        <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Details */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-brand-textPrimary font-section">DarshanEase HQ</h3>
            <p className="text-xs text-brand-textSecondary leading-relaxed">
              Our support team works closely with devosthanam authorities to resolve slot queues. We offer 24/7 emergency booking updates during festival seasons.
            </p>
            
            <div className="space-y-4 text-xs text-brand-textSecondary">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0" />
                <span>108, Mandir Marg, Connaught Place, New Delhi - 110001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <span>+91 11 4050 6070 (Toll Free support)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <span>support@darshanease.com</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-brand-bgSurface p-6 md:p-8 rounded-2xl border border-brand-borderSubtle shadow-soft-md space-y-4">
            <h4 className="text-sm font-bold text-brand-textPrimary font-section">Send Us a Direct Message</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Anand Sharma" 
                className="w-full p-2.5 border border-brand-borderSubtle rounded-lg bg-brand-bgBase text-xs outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="e.g. anand@gmail.com" 
                className="w-full p-2.5 border border-brand-borderSubtle rounded-lg bg-brand-bgBase text-xs outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-textSecondary uppercase">Your Message</label>
              <textarea 
                rows="4" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Describe your inquiry..." 
                className="w-full p-2.5 border border-brand-borderSubtle rounded-lg bg-brand-bgBase text-xs outline-none focus:border-brand-gold resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-3 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending...' : 'Dispatch Message'}
              <Send size={14} />
            </button>
          </form>

        </section>

      </div>
      <Footer />
    </div>
  );
}
