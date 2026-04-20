"use client";
import React, { useState } from 'react';
import { Check, Zap, Crown, Building2, CreditCard, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? '0' : '0',
      description: 'Perfect for beginners starting their social journey.',
      features: ['50 Posts / month', '3 Social Accounts', 'Basic Analytics', 'Standard Support'],
      icon: <Zap className="text-blue-500" />,
      buttonText: 'Current Plan',
      isCurrent: true,
    },
    {
      name: 'Pro Growth',
      price: billingCycle === 'monthly' ? '29' : '290',
      description: 'Best for creators and small businesses.',
      features: ['Unlimited Posts', '15 Social Accounts', 'Advanced Analytics', 'Priority Support', 'AI Content Assistant'],
      icon: <Crown className="text-amber-500" />,
      buttonText: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Advanced features for large scale agencies.',
      features: ['Unlimited Everything', 'All 12+ Platforms', 'Dedicated Manager', 'API Access', 'Custom Branding'],
      icon: <Building2 className="text-indigo-500" />,
      buttonText: 'Contact Sales',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight mb-4">Plans & Billing</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Scale your brand with PostJet. Choose a plan that fits your growth.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 bg-slate-200 rounded-full p-1 transition-all relative"
            >
              <div className={`w-5 h-5 bg-blue-600 rounded-full transition-all ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Yearly <span className="text-green-500 text-[10px] bg-green-50 px-2 py-0.5 rounded-full ml-1">SAVE 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 relative flex flex-col ${plan.popular ? 'border-blue-500 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-xl'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-black mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">${plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-slate-400 font-bold text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>}
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-green-50 p-1 rounded-full text-green-600">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${plan.isCurrent ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg active:scale-95'}`}
              >
                {plan.buttonText} {!plan.isCurrent && <ArrowRight size={14} />}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600">
              <CreditCard size={32} />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tight">Payment Methods</h4>
              <p className="text-xs text-slate-500 font-medium">Manage your credit cards and billing information.</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Visa **** 4242</span>
             </div>
             <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Update
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}