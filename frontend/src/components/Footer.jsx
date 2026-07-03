import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin, Send, Flame } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-textPrimary text-white border-t border-brand-borderSubtle/10 pt-16 pb-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl text-brand-gold font-bold font-display tracking-tight">DarshanEase</span>
          </Link>
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            A premium modern platform bridging India's rich spiritual heritage with secure, hassle-free booking pipelines and direct temple contributions.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-brand-success bg-green-950/40 border border-green-900/50 px-3 py-1 rounded-md w-fit font-medium">
            <Flame size={12} className="animate-pulse" /> Verified Temple Trust Partner
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand-secondary font-sans">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-brand-textSecondary">
            <li><Link to="/explore" className="hover:text-brand-gold transition-colors">Explore Shrines</Link></li>
            <li><Link to="/about" className="hover:text-brand-gold transition-colors">About Our Mission</Link></li>
            <li><Link to="/faq" className="hover:text-brand-gold transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal & Trust */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand-secondary font-sans">Policy & Trust</h4>
          <ul className="space-y-2 text-xs text-brand-textSecondary">
            <li><Link to="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
            <li><span className="text-[10px] bg-amber-500/10 text-brand-secondary border border-amber-500/20 px-2 py-0.5 rounded">80G Tax Exemptions</span></li>
          </ul>
        </div>

        {/* Column 4: Newsletter Sign-up */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand-secondary font-sans">Divine Newsletter</h4>
          <p className="text-xs text-brand-textSecondary">Subscribe to receive updates on upcoming temple festivals and auspicious sevas.</p>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to divine newsletter!'); }}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-gold w-full"
              required
            />
            <button type="submit" className="p-2 bg-brand-gold hover:bg-brand-hover text-white rounded transition-colors shrink-0">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© {currentYear} DarshanEase Technologies. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
