"use client";
import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Globe } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$' });
  const [loading, setLoading] = useState(true);

  // Auto Currency Detection
  useEffect(() => {
    async function detectCurrency() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country === 'IN') {
          setCurrency({ code: 'INR', symbol: '₹' });
        } else {
          setCurrency({ code: 'USD', symbol: '$' });
        }
      } catch (error) {
        console.error("Detection failed:", error);
      } finally {
        setLoading(false);
      }
    }
    detectCurrency();
  }, []);

  const basePlans = [
    {
      name: 'Starter',
      usdPrice: 9,
      inrPrice: 499,
      description: 'Ideal for individuals starting their social journey.',
      features: ['30 Posts / month', 'Any 2 Platforms', 'Standard Analytics', '7-Day Free Trial'],
      icon: <Zap className="text-blue-500" />,
    },
    {
      name: 'Pro Growth',
      usdPrice: 29,
      inrPrice: 1499,
      description: 'Best for creators and growing businesses.',
      features: ['Unlimited Posts', 'All Platforms', 'AI Content Tools', 'Scheduling Engine', 'Priority Support'],
      icon: <Crown className="text-amber-500" />,
      popular: true,
    }
  ];

  const calculatePrice = (plan: any) => {
    let price = currency.code === 'INR' ? plan.inrPrice : plan.usdPrice;
    if (billingCycle === 'yearly') {
      price = Math.round(price * 12 * 0.8); // 20% Discount
    }
    return price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
             <Globe size={14} /> Currency: {loading ? 'Detecting...' : currency.code}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Pricing Plans</h1>
          <p className="text-slate-500 font-medium">Choose the perfect plan for your business growth.</p>

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
              Yearly <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded-full ml-1 border border-green-100 font-black">SAVE 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards - 2 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {basePlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-[2.5rem] p-10 border-2 transition-all duration-500 flex flex-col ${plan.popular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                  Best Value
                </div>
              )}

              <div className="mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">{plan.icon}</div>
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight">
                    {currency.symbol}{calculatePrice(plan)}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="bg-blue-50 p-1 rounded-full text-blue-600"><Check size={12} strokeWidth={4} /></div>
                    <span className="text-sm font-bold text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => toast.success('Trial Started!')}
                className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-xl hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
              >
                Start 7-Day Free Trial
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}