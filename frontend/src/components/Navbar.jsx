import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, User, Calendar, ShieldAlert, LayoutDashboard, LogOut, Menu, X, Bell } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Read real-time authentication states from browser local storage
  const token = localStorage.getItem('darshanease_token');
  const userString = localStorage.getItem('darshanease_user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Navigation items definition
  const publicLinks = [
    { name: 'Explore Temples', path: '/explore', icon: Compass },
    { name: 'About Us', path: '/about', icon: User },
    { name: 'FAQ', path: '/faq', icon: Compass },
    { name: 'Contact', path: '/contact', icon: Compass }
  ];

  const authLinks = [];
  if (token && user) {
    authLinks.push({ name: 'Book Darshan', path: '/booking', icon: Calendar });
    authLinks.push({ name: 'My Passes', path: '/dashboard', icon: User });

    if (user.role === 'organizer' || user.role === 'admin') {
      authLinks.push({ name: 'Scanner Gate', path: '/organizer', icon: ShieldAlert });
    }
    if (user.role === 'admin') {
      authLinks.push({ name: 'Ops Center', path: '/admin', icon: LayoutDashboard });
    }
  }

  const allLinks = [...publicLinks, ...authLinks];

  const handleSignOut = () => {
    localStorage.removeItem('darshanease_token');
    localStorage.removeItem('darshanease_user');
    alert('Secure session terminated successfully.');
    window.location.href = '/auth';
  };

  return (
    <nav className="sticky top-0 z-50 glass-navbar px-6 py-4 flex items-center justify-between">
      
      {/* Brand Identity Logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center text-white font-bold text-sm shadow-soft-sm">
          🕉️
        </div>
        <span className="text-xl md:text-2xl text-brand-gold font-bold font-display tracking-tight">DarshanEase</span>
      </Link>

      {/* Mid-Section Navigation Links for Desktop */}
      <div className="hidden lg:flex items-center gap-6">
        {allLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs uppercase tracking-wider font-semibold relative py-1 transition-colors duration-200 ${
                isActive ? 'text-brand-gold font-bold' : 'text-brand-textSecondary hover:text-brand-gold'
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right-Section Authentication Controls */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-sans">
        {token && user ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-brand-textSecondary bg-brand-bgBase border border-brand-borderSubtle px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-soft-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              🙏 {user.name} ({user.role})
            </span>
            <button 
              onClick={handleSignOut}
              className="p-2 border border-brand-borderSubtle text-brand-error hover:bg-red-50 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="px-5 py-2.5 bg-brand-gold hover:bg-brand-hover text-white font-bold rounded-full shadow-soft-sm hover:shadow-soft-md transition-all text-xs uppercase tracking-wider cursor-pointer transform hover:-translate-y-0.5"
          >
            Access Vault
          </Link>
        )}
      </div>

      {/* Mobile Burger Trigger Button */}
      <div className="lg:hidden flex items-center gap-3">
        {token && user && (
          <Link to="/dashboard" className="p-2 border border-brand-borderSubtle text-brand-textSecondary rounded-full">
            <User size={16} />
          </Link>
        )}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-brand-textPrimary hover:bg-brand-bgBase rounded-lg transition-colors border border-brand-borderSubtle"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-[69px] left-0 right-0 bg-brand-bgSurface border-b border-brand-borderSubtle shadow-soft-lg p-6 flex flex-col gap-4 lg:hidden z-40 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-wider text-brand-textSecondary font-bold mb-1">Navigation</p>
            {allLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${
                  location.pathname === link.path ? 'bg-amber-50 text-brand-gold' : 'text-brand-textSecondary hover:bg-brand-bgBase'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-brand-borderSubtle pt-4 mt-2">
            {token && user ? (
              <div className="flex flex-col gap-3">
                <div className="px-3 py-2 bg-brand-bgBase rounded border border-brand-borderSubtle text-xs text-brand-textSecondary flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Devotee: <strong>{user.name}</strong> ({user.role})
                </div>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="w-full py-2.5 border border-brand-borderSubtle text-brand-error hover:bg-red-50 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Terminate Session
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-brand-gold text-white text-center font-bold rounded-lg text-xs uppercase tracking-wider block"
              >
                Access Vault
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}