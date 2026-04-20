"use client";
import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Building2, CreditCard, ArrowRight, Gift, Globe } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PostJetDynamicPricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$', rate: 1 });
  const [loading, setLoading] = useState(true);

  // --- AUTO CURRENCY DETECTION ---
  useEffect(() => {
    async function detectCurrency() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // ఒకవేళ యూజర్ ఇండియా అయితే INR, లేదంటే USD (బేస్ కరెన్సీ)
        if (data.country === 'IN') {
          setCurrency({ code: 'INR', symbol: '₹', rate: 83 }); // 1 USD = 83 INR (Approx)
        } else if (data.currency) {
          // వేరే దేశాల కరెన్సీ కోడ్ మరియు సింబల్స్ సెట్ చేయడం
          setCurrency({ 
            code: data.currency, 
            symbol: getSymbol(data.currency), 
            rate: data.country === 'US' ? 1 : 1 // ఇక్కడ రియల్ టైమ్ రేట్స్ కోసం వేరే API వాడొచ్చు
          });
        }
      } catch (error) {
        console.error("Currency detection failed:", error);
      } finally {
        setLoading(false);
      }
    }
    detectCurrency();
  }, []);

  function getSymbol(code: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code })
      .format(0).replace(/[0-9.,]/g, '').trim();
  }

  // --- PRICING LOGIC ---
  const basePlans = [
    {
      name: 'Starter',
      usdPrice: 9,
      description: 'Ideal for individuals starting their journey.',
      features: ['30 Posts / month', 'Any 2 Platforms', 'Basic Analytics'],
      icon: <Zap className="text-blue-500" />,
    },
    {
      name: 'Pro Growth',
      usdPrice: 29,
      description: 'Best for creators and growing businesses.',
      features: ['Unlimited Posts', 'All Platforms', 'AI Content Tools', 'Scheduling'],
      icon: <Crown className="text-amber-500" />,
      popular: true,
    },
    {
      name: 'Enterprise',
      usdPrice: 79,
      description: 'Advanced solutions for large teams.',
      features: ['Unlimited Everything', 'Custom Branding', 'API Access', '24/7 Support'],
      icon: <Building2 className="text-indigo-500" />,
    }
  ];

  const calculatePrice = (usd: number) => {
    let price = usd;
    // ఇండియా అయితే నువ్వు చెప్పిన ఫిక్స్‌డ్ రేట్స్ వాడదాం (USD Conversion కాకుండా)
    if (currency.code === 'INR') {
      if (usd === 9) price = 499;
      else if (usd === 29) price = 1499;
      else if (usd === 79) price = 3999;
    } else {
      price = usd; // మిగతా దేశాలకి USD లోనే చూపిద్దాం
    }

    // Yearly Discount (20%)
    if (billingCycle === 'yearly') {
      price = Math.round(price * 12 * 0.8);
    }

    return price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
             <Globe size={14} /> Location Detected: {loading ? 'Detecting...' : currency.code}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Simple, Transparent Pricing</h1>
          
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
              Yearly <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded-full ml-1 border border-green-100 font-black">-20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {basePlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 flex flex-col ${plan.popular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-sm'}`}
            >
              <div className="mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">{plan.icon}</div>
                <h3 className="text-xl font-black mb-1">{plan.name}</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">
                    {currency.symbol}{calculatePrice(plan.usdPrice)}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="bg-blue-50 p-1 rounded-full text-blue-600"><Check size={10} strokeWidth={4} /></div>
                    <span className="text-xs font-bold text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
                Start 7-Day Trial
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}