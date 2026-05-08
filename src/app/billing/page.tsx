"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft, Zap, Shield, Sparkles } from 'lucide-react';

export default function BillingPage() {
  const router = useRouter();

  // Pricing Data based on your requirements
  const plans = [
    {
      name: "7-Day Trial",
      price: "Free",
      sub: "First 7 Days",
      features: [
        "Access all 15+ apps",
        "100 Posts total limit",
        "Basic Analytics",
        "Standard Support"
      ],
      button: "Start Free Trial",
      color: "text-slate-400",
      border: "border-white/10",
      icon: <Zap size={20} />
    },
    {
      name: "Starter",
      price: "Rs. 499",
      sub: "Per Month",
      features: [
        "3 Platforms",
        "100 Posts / month",
        "Basic Analytics",
        "Email Support"
      ],
      button: "Select Starter",
      color: "text-[#00D1FF]",
      border: "border-[#00D1FF]/30",
      popular: true,
      icon: <Shield size={20} />
    },
    {
      name: "Pro Blast",
      price: "Rs. 1499",
      sub: "Per Month",
      features: [
        "15+ Platforms",
        "Unlimited Posts",
        "AI Content Generator",
        "Priority 24/7 Support"
      ],
      button: "Go Unlimited",
      color: "text-indigo-400",
      border: "border-indigo-500/50",
      icon: <Sparkles size={20} />
    }
  ];

  return (
    <div className="h-screen bg-[#0A0F1C] text-white flex flex-col overflow-hidden">
      
      {/* 🚀 HEADER WITH HOME LINK */}
      <nav className="max-w-7xl w-full mx-auto px-6 md:px-10 py-6 flex items-center justify-between z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => router.push('/')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-all shadow-lg shadow-indigo-500/20">
            P
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">PostJet</span>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </nav>

      {/* 💳 PRICING SECTION */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-3">
              Choose Your <span className="text-[#00D1FF]">Power</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
              Scale your social presence with zero friction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative p-8 lg:p-10 rounded-[48px] bg-white/[0.03] border ${plan.border} backdrop-blur-xl transition-all hover:scale-[1.02] duration-300 flex flex-col`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00D1FF] text-black text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-cyan-500/20">
                    Most Popular
                  </span>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-black uppercase tracking-tight ${plan.color}`}>
                    {plan.name}
                  </h3>
                  <div className={`${plan.color} opacity-80`}>{plan.icon}</div>
                </div>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl lg:text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{plan.sub}</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <Check size={12} className="text-indigo-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => router.push('/register')}
                  className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${
                    plan.popular 
                    ? 'bg-[#00D1FF] text-black shadow-[0_0_30px_rgba(0,209,255,0.2)] hover:shadow-[0_0_40px_rgba(0,209,255,0.4)]' 
                    : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            Secure payment processing. Cancel any time.
          </p>
        </div>
      </div>

      {/* Subtle Background Glow */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-96 h-96 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
}