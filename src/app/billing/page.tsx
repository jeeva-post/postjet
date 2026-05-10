"use client";
import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

export default function BillingPage() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    // Paddle Sandbox Initialization
    initializePaddle({ 
      environment: 'sandbox', 
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      checkout: {
        settings: {
          displayMode: 'overlay',
          theme: 'dark'
        }
      }
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        console.log("Paddle Initialized Successfully ✅");
        setPaddle(paddleInstance);
      }
    });
  }, []);

  const handleCheckout = (priceId: string | undefined) => {
    // --- DEBUG LOGS ---
    console.log("Clicked Price ID:", priceId);
    console.log("Token Status:", process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ? "Token Found" : "Token Missing ❌");

    if (!paddle) {
      alert("Paddle loading... please wait a moment.");
      return;
    }

    if (!priceId || priceId.trim() === "") {
      alert("Error: Price ID is missing or undefined! Check your Vercel Env Variables.");
      console.error("The priceId passed to checkout is invalid:", priceId);
      return;
    }

    // Opening Checkout
    paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
      <p className="text-zinc-400 mb-12 text-center max-w-lg">
        Upgrade to Pro to unlock 17+ platforms automation and advanced video posting.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Starter Plan - $6.00 */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition">
          <h2 className="text-xl font-medium mb-2 text-zinc-300">Starter</h2>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold">$6.00</span>
            <span className="text-zinc-500 ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-8 text-zinc-400 text-sm">
            <li>✓ Connect up to 5 Accounts</li>
            <li>✓ Image & Text Posting</li>
            <li>✓ Basic Analytics</li>
          </ul>
          <button 
            onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PRICE_ID_STARTER)}
            className="w-full py-3 px-6 rounded-xl bg-zinc-100 text-black hover:bg-white transition font-bold"
          >
            Get Started
          </button>
        </div>

        {/* Pro Blast Plan - $18.00 */}
        <div className="bg-zinc-900 border-2 border-blue-600 p-8 rounded-3xl relative shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest">
            MOST POPULAR
          </div>
          <h2 className="text-xl font-medium mb-2 text-blue-400">Pro Blast</h2>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold">$18.00</span>
            <span className="text-zinc-500 ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-8 text-zinc-300 text-sm">
            <li>✓ All 17+ Social Platforms</li>
            <li>✓ HD Video Upload Support</li>
            <li>✓ Priority API Integration</li>
            <li>✓ Unlimited Monthly Posts</li>
          </ul>
          <button 
            onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PRICE_ID_PRO)}
            className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-900/20"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="mt-12 text-zinc-600 text-xs">
        Secure checkout powered by Paddle Sandbox
      </div>
    </div>
  );
}