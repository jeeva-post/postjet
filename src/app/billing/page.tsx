"use client";
import { useEffect, useState } from 'react';
import { PADDLE_IDS } from '@/lib/paddle-config';

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Setup: (options: { token: string }) => void;
      Checkout: { open: (options: any) => void };
    };
  }
}

export default function BillingPage() {
  const [paddleReady, setPaddleReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const initializePaddle = () => {
      if (!window.Paddle || !PADDLE_IDS.TOKEN) {
        setLoadError(true);
        return;
      }

      try {
        window.Paddle.Environment.set('sandbox');
        window.Paddle.Setup({ token: PADDLE_IDS.TOKEN });
        setPaddleReady(true);
      } catch (error) {
        console.error('Paddle initialization failed:', error);
        setLoadError(true);
      }
    };

    if (window.Paddle) {
      initializePaddle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = initializePaddle;
    script.onerror = () => setLoadError(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = (priceId: string) => {
    if (!window.Paddle || !paddleReady) {
      setLoadError(true);
      return;
    }

    window.Paddle.Checkout.open({
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
      },
      items: [{ priceId, quantity: 1 }],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10 text-center">
          <h1 className="text-4xl font-semibold mb-4">PostJet Pro Plans</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-8">
            Unlock premium automation features and publish to all supported platforms with one click. Paddle handles checkout securely so payment details are never stored by PostJet.
          </p>
          {loadError ? (
            <p className="mt-4 text-sm text-red-400">
              Paddle checkout failed to load. Refresh the page or contact support if this persists.
            </p>
          ) : !paddleReady ? (
            <p className="mt-4 text-sm text-zinc-400">Loading secure checkout...</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 flex flex-col items-center text-center">
            <h2 className="text-xl mb-4 text-zinc-400">Starter</h2>
            <p className="text-5xl font-bold mb-8">$6<span className="text-base align-super">/mo</span></p>
            <button
              type="button"
              disabled={!paddleReady}
              onClick={() => handleCheckout(PADDLE_IDS.STARTER)}
              className="w-full py-3 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-100 text-black hover:bg-zinc-200"
            >
              Get Started
            </button>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border-2 border-blue-600 flex flex-col items-center text-center">
            <h2 className="text-xl mb-4 text-blue-400">Pro Blast</h2>
            <p className="text-5xl font-bold mb-8">$15<span className="text-base align-super">.89/mo</span></p>
            <button
              type="button"
              disabled={!paddleReady}
              onClick={() => handleCheckout(PADDLE_IDS.PRO)}
              className="w-full py-3 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
