"use client";

import React from 'react';
import { Check, Zap, Crown, CreditCard, History, ArrowUpRight, Clock } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    duration: '7 Days',
    description: 'Perfect for testing the waters',
    features: ['Any 2 Platforms', '10 Posts daily', 'Basic Analytics', '7-day Trial period'],
    buttonText: 'Current Plan',
    current: true,
    color: 'border-slate-700'
  },
  {
    name: 'Standard',
    price: '$5',
    duration: 'per month',
    description: 'Great for growing creators',
    features: ['Any 3 Platforms', 'Unlimited Posts', 'Advanced Analytics', 'Priority Support'],
    buttonText: 'Upgrade Now',
    current: false,
    color: 'border-cyan-500/30'
  },
  {
    name: 'Business / Unlimited',
    price: '$15',
    duration: 'per month',
    description: 'The ultimate power center',
    features: ['Unlimited Platforms', 'Unlimited Posts', 'Team Collaboration', 'Custom Reports', '24/7 Dedicated Support'],
    buttonText: 'Go Unlimited',
    current: false,
    color: 'border-purple-500/50'
  }
];

export default function BillingPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white tracking-tight italic">Choose Your Plan</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Scale your social media presence with PostJet.</p>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-[32px] border bg-[#0f172a] transition-all duration-300 hover:-translate-y-2 ${
              plan.current 
              ? 'border-cyan-500 shadow-[0_0_40px_-15px_rgba(6,182,212,0.4)]' 
              : `${plan.color} border-white/5 hover:border-white/20`
            }`}
          >
            {/* BADGES */}
            {plan.name === 'Free Trial' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Clock size={12} /> {plan.duration} Left
              </div>
            )}
            
            {plan.name === 'Business / Unlimited' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Crown size={12} /> Best Value
              </div>
            )}

            {/* PRICE INFO */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-slate-500 text-sm">/{plan.duration === '7 Days' ? 'trial' : 'mo'}</span>
              </div>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{plan.description}</p>
            </div>

            {/* FEATURES LIST */}
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className={`p-1 rounded-full ${plan.current ? 'bg-cyan-500/10' : 'bg-white/5'}`}>
                    <Check size={12} className={plan.current ? 'text-cyan-400' : 'text-slate-500'} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* ACTION BUTTON */}
            <button className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              plan.current 
              ? 'bg-white/5 text-slate-400 cursor-default border border-white/10' 
              : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 active:scale-95'
            }`}>
              {plan.buttonText} {!plan.current && <ArrowUpRight size={18} />}
            </button>
          </div>
        ))}
      </div>

      {/* BILLING HISTORY / INVOICES TABLE */}
      <div className="bg-[#0f172a] border border-white/5 rounded-[32px] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 italic">
            <History size={22} className="text-cyan-500" /> Billing History
          </h3>
          <button className="text-xs font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors">
            <CreditCard size={14} /> Manage Card
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="pb-4 px-4">Invoice ID</th>
                <th className="pb-4 px-4">Date</th>
                <th className="pb-4 px-4">Amount</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: 'INV-2026-001', date: 'May 01, 2026', amount: '$0.00', status: 'Trial' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-4 font-medium text-slate-300">{row.id}</td>
                  <td className="py-5 px-4 text-slate-500">{row.date}</td>
                  <td className="py-5 px-4 text-white font-bold">{row.amount}</td>
                  <td className="py-5 px-4">
                    <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-full border border-cyan-500/20 uppercase">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <button className="text-slate-500 hover:text-cyan-500 transition-colors">
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <p className="mt-8 text-center text-slate-600 text-xs font-medium">
        Secure checkout powered by Stripe. All prices are in USD ($). 
        You can cancel your subscription at any time.
      </p>
    </div>
  );
}