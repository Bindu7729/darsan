import React from 'react';
import { HelpCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function FAQ() {
  const faqs = [
    { q: "Is the ticket booking direct-to-temple?", a: "Yes. All funds collected are securely routed to the official bank accounts of the respective temple devasthanams. We only charge a small standard convenience fee to manage the technical server infrastructure." },
    { q: "What documents are required for check-in validation?", a: "You need a printout or digital copy of the booking pass with the QR code, along with the original Government-issued ID card (Aadhaar, Passport, or PAN) of all the registered devotees." },
    { q: "How can I get 80G tax exemptions for donations?", a: "Upon making a direct temple donation, a receipt is generated containing the temple trust registration details. You can download this receipt directly from your personal dashboard ledger for tax filings." },
    { q: "Can I cancel a confirmed booking?", a: "Yes. Bookings can be cancelled up to 24 hours before the scheduled reporting date. Cancelled slots are immediately released back to the temple capacity pools to allow other devotees to book." },
    { q: "What is the refund policy for cancellations?", a: "For ticket categories that require charge parameters, refunds are processed back to the original bank source within 5-7 working days, minus standard platform transaction fees." },
    { q: "Is there a VIP dress code preference?", a: "Traditional clothing is mandatory at most major shrines, especially for VIP entries. Men are advised to wear Dhotis/Kurtas, and women should wear Sarees/Salwar Kameez with Dupattas." }
  ];

  return (
    <div className="min-h-screen bg-brand-bgBase flex flex-col justify-between">
      <div>
        
        {/* FAQ Header */}
        <section className="py-16 bg-gradient-to-b from-[#FFFBEB] to-brand-bgBase border-b border-brand-borderSubtle px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">Help & Support Center</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-textPrimary">Frequently Asked Questions</h1>
            <p className="text-xs md:text-sm text-brand-textSecondary leading-relaxed">
              Find instant answers to billing queries, check-in requirements, dress codes, and slot cancellations.
            </p>
          </div>
        </section>

        {/* Accordions */}
        <section className="max-w-3xl mx-auto px-6 py-12 space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-brand-borderSubtle bg-brand-bgSurface space-y-2 shadow-soft-sm">
              <h4 className="text-sm font-bold text-brand-textPrimary flex items-center gap-1.5">
                <HelpCircle size={16} className="text-brand-gold shrink-0" /> {faq.q}
              </h4>
              <p className="text-xs text-brand-textSecondary leading-relaxed pl-6 border-l-2 border-brand-gold/60">{faq.a}</p>
            </div>
          ))}
        </section>

      </div>
      <Footer />
    </div>
  );
}
