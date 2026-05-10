"use client";
import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

export default function BillingPage() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    // Sandbox initialization
    initializePaddle({ 
      environment: 'sandbox', 
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddleInstance) => {
      if (paddleInstance) setPaddle(paddleInstance);
    });
  }, []);

  const handleCheckout = (priceId: string) => {
    if (!paddle) return;
    paddle.Checkout.open({
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
      },
      items: [{ priceId: priceId, quantity: 1 }],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
      <p className="text-zinc-400 mb-12">Upgrade to unlock more features for your social media automation.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Starter Plan */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
          <h2 className="text-xl font-medium mb-2">Starter</h2>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold">$6.00</span>
            <span className="text-zinc-500 ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-8 text-zinc-300">
            <li>✓ Up to 5 Social Accounts</li>
            <li>✓ Image & Video Posting</li>
            <li>✓ 7-Day Free Trial</li>
          </ul>
          <button 
            onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PRICE_ID_STARTER!)}
            className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Start Free Trial
          </button>
        </div>

        {/* Pro Blast Plan */}
        <div className="bg-zinc-900 border-2 border-blue-600 p-8 rounded-3xl relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">POPULAR</div>
          <h2 className="text-xl font-medium mb-2">Pro Blast</h2>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold">$18.00</span>
            <span className="text-zinc-500 ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-8 text-zinc-300">
            <li>✓ Unlimited Social Accounts</li>
            <li>✓ Advanced Analytics</li>
            <li>✓ Priority Support</li>
          </ul>
          <button 
            onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PRICE_ID_PRO!)}
            className="w-full py-3 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 transition font-semibold"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}