"use client";
import React, { useState } from 'react';
import { Check, Zap, Crown, Building2, CreditCard, ArrowRight, Gift } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PostJetPricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? '499' : '399',
      usd: billingCycle === 'monthly' ? '9' : '7',
      description: 'Ideal for individuals starting their social journey.',
      features: ['30 Posts / month', 'Any 2 Platforms', 'Standard Analytics', 'Basic Support'],
      icon: <Zap className="text-blue-500" />,
      buttonText: 'Start 7-Day Free Trial',
      trial: true
    },
    {
      name: 'Pro Growth',
      price: billingCycle === 'monthly' ? '1,499' : '1,199',
      usd: billingCycle === 'monthly' ? '29' : '23',
      description: 'Best for creators and growing small businesses.',
      features: ['Unlimited Posts', 'All Platforms', 'AI Content Tools', 'Scheduling Engine', 'Priority Support'],
      icon: <Crown className="text-amber-500" />,
      buttonText: 'Start 7-Day Free Trial',
      popular: true,
      trial: true
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? '3,999' : '3,199',
      usd: billingCycle === 'monthly' ? '79' : '63',
      description: 'Advanced solutions for agencies and large teams.',
      features: ['Unlimited Everything', 'All Platforms', 'Advanced AI Suite', 'Dedicated Manager', 'API Access'],
      icon: <Building2 className="text-indigo-500" />,
      buttonText: 'Contact for Enterprise',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Gift size={14} /> No Credit Card Required for 7-Day Trial
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4 italic">Choose Your PostJet Journey</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Professional tools at unbeatable prices. Scale your social presence today.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 bg-slate-200 rounded-full p-1 transition-all"
            >
              <div className={`w-5 h-5 bg-blue-600 rounded-full transition-all ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Yearly <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded-full ml-1 border border-green-100">SAVE 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 relative flex flex-col ${plan.popular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                  Best Value
                </div>
              )}

              <div className="mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-black mb-1">{plan.name}</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">₹{plan.price}</span>
                  <span className="text-slate-400 font-bold text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">Approx. ${plan.usd} USD</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-blue-50 p-1 rounded-full text-blue-600">
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => toast.success(`${plan.name} trial started!`)}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg'}`}
              >
                {plan.buttonText} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="text-center bg-slate-100/50 p-8 rounded-[2rem] border border-slate-200">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Why PostJet?</p>
           <h4 className="text-lg font-black text-slate-800">Global power, local prices.</h4>
           <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto italic">
             "While other tools charge over ₹5,000 for basic features, we bring you Enterprise-grade power for a fraction of the cost. More value, more posts, more growth."
           </p>
        </div>

      </div>
    </div>
  );
}