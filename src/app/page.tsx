import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-black tracking-tighter italic">POST<span className="text-blue-600">JET</span></h1>
        <Link href="/api/auth/login" className="bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Launch App</Link>
      </nav>

      <main className="max-w-4xl mx-auto text-center pt-32 pb-20 px-6">
        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100">
          All-in-one social engine
        </div>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none text-black mb-10">
          ONE CLICK. <br/> <span className="text-blue-600">EVERYWHERE.</span>
        </h2>
        <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
          The cleanest way to post to Facebook, Instagram, and WhatsApp. No clutter, just results.
        </p>
        <Link href="/api/auth/register" className="inline-flex items-center gap-4 bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-bold text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all">
          Start for Free <ArrowRight />
        </Link>
      </main>

      <section className="border-t border-slate-100 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center opacity-40 grayscale flex justify-center gap-20">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="h-8" />
        </div>
      </section>
    </div>
  );
}