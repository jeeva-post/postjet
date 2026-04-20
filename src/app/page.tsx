"use client";
import Link from 'next/link';
import { ArrowRight, Zap, Share2, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100">
          <Zap size={14} className="fill-blue-600" /> Blast Your Content Everywhere
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8 italic">
          ONE POST.<br />
          <span className="text-blue-600">ALL PLATFORMS.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12">
          PostJet is the ultimate social engine. Write once, blast everywhere. Manage 12+ platforms from a single powerful dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-3">
            Start Free Trial <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard/billing" className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:border-blue-200 transition-all flex items-center justify-center">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <Feature icon={<Share2 className="text-blue-600" />} title="12+ Platforms" desc="Connect FB, Insta, X, Telegram, and more in seconds." />
          <Feature icon={<BarChart3 className="text-indigo-600" />} title="Smart Analytics" desc="Track engagement and growth across all networks." />
          <Feature icon={<ShieldCheck className="text-green-600" />} title="Secure Engine" desc="Enterprise-grade security for all your social accounts." />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
    </div>
  );
}