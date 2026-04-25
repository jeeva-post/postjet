import Link from 'next/link';
import { ArrowRight, Zap, Layers3, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans">
      {/* Soft Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic">P</div>
            <h1 className="text-2xl font-bold text-black tracking-tighter">Post<span className='text-blue-600'>Jet</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/api/auth/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Login</Link>
            <Link href="/api/auth/register" className="text-xs bg-black text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-wider hover:bg-slate-800 transition-all">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-1 rounded-full text-xs font-semibold mb-6 shadow-inner">
          <Zap size={14} className="animate-pulse" />
          One Click, Infinite Reach
        </div>
        <h2 className="text-6xl md:text-8xl font-extrabold text-black tracking-tighter leading-[0.95] mb-8">
          Post to all social media <br/> <span className="text-blue-600">in one click.</span>
        </h2 >
        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
          Stop wasting hours switching tabs. PostJet lets you manage, schedule, and analyze your Facebook, Instagram, and WhatsApp posts from a single, intuitive dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/api/auth/register" className="group flex items-center gap-2.5 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1">
            Start Your Free Mission
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-black py-5 px-6">Learn more →</Link>
        </div>
      </main>

      {/* Trust Section with Real Logos */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Official API Integrations</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png" alt="Facebook" className="h-8 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="h-10 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-9 object-contain" />
          </div>
        </div>
      </section>
    </div>
  );
}