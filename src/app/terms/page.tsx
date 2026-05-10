import React from 'react';
import { Home } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 p-8 md:p-20 font-sans leading-relaxed">
      <div className="max-w-3xl mx-auto">
        
        {/* 🏠 BACK TO HOME BUTTON */}
        <div className="mb-10">
          <a href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 text-xs font-black uppercase tracking-widest transition-all">
            <Home size={14} /> Back to Home
          </a>
        </div>

        <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter text-slate-900 border-b-4 border-indigo-600 inline-block">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8 italic uppercase tracking-widest font-bold">Last Updated: May 2026</p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">1. Subscription & Payments</h2>
            <p>Our Service is billed via <strong>Paddle</strong>. Paddle handles all global taxes and secure payment processing.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">2. Use of Service</h2>
            <p>PostJet connects to 15+ social platforms. You agree to comply with the policies of all connected platforms.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">3. Limitation of Liability</h2>
            <p>PostJet shall not be liable for any incidental or consequential damages resulting from your use of the service.</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <p>© 2026 PostJet</p>
          <a href="mailto:support@postjet.vercel.app" className="hover:text-indigo-600 transition-colors underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}