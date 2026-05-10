"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Globe, Share2, Sparkles, Shield } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleNav = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col">
      
      {/* 🚀 FIXED HEADER */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('/')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-all shadow-lg shadow-indigo-500/20">P</div>
            <span className="text-2xl font-black italic tracking-tighter uppercase">PostJet</span>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNav('/login')} 
              className="text-sm font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest"
            >
              Login
            </button>
            <button 
              onClick={() => handleNav('/register')} 
              className="bg-[#00D1FF] text-black px-6 py-3 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* 🔵 HERO SECTION */}
      <div className="flex-grow max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-5 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe size={12} /> The World's Most Integrated Social Suite
            </div>
            
            <h1 className="text-6xl md:text-[84px] font-black leading-[0.95] tracking-tighter">
                One Dashboard. <br/>
              <span className="text-[#00D1FF]">Every Network.</span>
            </h1>
            
            <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
              Stop switching tabs. **PostJet** connects to 15+ social platforms, allowing you to draft, schedule, and blast your content globally in one click. Manage your entire digital presence from a single command center.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <button 
                onClick={() => handleNav('/login')} 
                className="group w-full sm:w-auto bg-[#00D1FF] text-black px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,209,255,0.4)] transition-all active:scale-95"
              >
                Open Dashboard <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => handleNav('/billing')}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/10 font-black text-lg hover:bg-white/5 transition-all text-center"
              >
                Explore plans
              </button>
            </div>
          </div>

          {/* RIGHT SIDE FEATURE CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[56px] p-10 relative overflow-hidden group">
               <h3 className="text-3xl font-black italic tracking-tighter leading-tight italic mb-8 uppercase">Features</h3>
               <div className="space-y-4">
                  {[
                    { title: 'Multi-platform Sync', icon: <Share2 size={18} />, desc: 'Post to LinkedIn, TikTok, and 15+ more.' },
                    { title: 'AI Content Genius', icon: <Sparkles size={18} />, desc: 'High-converting captions in seconds.' },
                    { title: 'Subscription Gating', icon: <Shield size={18} />, desc: 'Professional features for your brand.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 bg-black/40 rounded-[28px] border border-white/5 hover:border-indigo-500/50 transition-all">
                       <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                          {item.icon}
                       </div>
                       <div>
                          <p className="text-slate-200 font-bold">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 FOOTER (Only Logic added, simple design) */}
      <footer className="bg-black/50 border-t border-white/5 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center font-black text-xs text-white">P</div>
              <span className="text-lg font-black italic tracking-tighter uppercase text-white">PostJet</span>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 All Rights Reserved</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <button onClick={() => handleNav('/terms')} className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Terms</button>
            <button onClick={() => handleNav('/privacy')} className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Privacy</button>
            <a href="mailto:support@postjet.vercel.app" className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Support</a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
              Merchant of Record <br />
              <span className="text-indigo-400/80">Paddle Payments</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}