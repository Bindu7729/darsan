import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-brand-bgSurface border border-brand-borderSubtle rounded-2xl shadow-soft-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 border border-red-200 text-brand-error rounded-full flex items-center justify-center mx-auto animate-bounce">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-display text-brand-textPrimary">404</h1>
            <h2 className="text-lg font-bold font-section text-brand-textPrimary">Path Not Found</h2>
            <p className="text-xs text-brand-textSecondary leading-relaxed">
              This spiritual path seems to have wandered off. The page you are looking for does not exist or has been relocated by the administrator.
            </p>
          </div>

          <Link 
            to="/" 
            className="inline-block w-full py-3 bg-brand-gold hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg shadow-soft-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
