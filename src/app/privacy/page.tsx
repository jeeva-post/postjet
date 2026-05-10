import React from 'react';
import { Home } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-8 md:p-20 font-sans leading-relaxed">
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-slate-100">
        
        {/* 🏠 BACK TO HOME BUTTON */}
        <div className="mb-10">
          <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-900 text-xs font-black uppercase tracking-widest transition-all">
            <Home size={14} /> Back to Home
          </a>
        </div>

        <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter text-slate-900 border-b-4 border-indigo-600 inline-block">Privacy Policy</h1>
        
        <section className="space-y-8 mt-10">
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900 uppercase">1. Data Handling</h2>
            <p>We store your social media tokens securely. We never share or sell your data to third parties.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900 uppercase">2. Billing Information</h2>
            <p>All payments are handled through <strong>Paddle</strong>. We do not store your credit card information.</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <p>PostJet © 2026</p>
          <a href="/terms" className="hover:text-indigo-600 transition-colors underline uppercase tracking-widest">Terms</a>
        </div>
      </div>
    </div>
  );
}