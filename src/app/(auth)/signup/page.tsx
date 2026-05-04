"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Github, Loader2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Error message state

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    // --- CHECK LOGIC START ---
    // 1. Browser memory nundi existing users ni thechukuntunnam
    const existingUsers = JSON.parse(localStorage.getItem('postjet_users') || '[]');

    // 2. Email idi varake register ayyindo ledo check chesthunnam
    const userExists = existingUsers.some((user: any) => user.email === email);

    if (userExists) {
      setTimeout(() => {
        setError("Ee email tho idi varake account create ayyindi. Login avvandi.");
        setIsLoading(false);
      }, 800);
      return;
    }
    // --- CHECK LOGIC END ---

    // Registration Success Logic
    setTimeout(() => {
      // New user ni save chesthunnam
      const newUser = { email, date: new Date().toISOString() };
      existingUsers.push(newUser);
      localStorage.setItem('postjet_users', JSON.stringify(existingUsers));

      // Dashboard ki redirect
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-bold text-black text-2xl shadow-lg shadow-cyan-500/20">P</div>
          <span className="text-2xl font-bold text-white tracking-tighter italic">PostJet</span>
        </div>

        <div className="bg-[#0f172a] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
            <p className="text-slate-500 text-sm font-medium">Start your 7-day free trial today.</p>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required name="name" type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required name="email" type="email" placeholder="name@example.com" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required name="password" type="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/60" />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-900 disabled:text-slate-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <> <Loader2 className="animate-spin" size={18} /> Validating...</>
              ) : (
                <>Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <button type="button" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm">
              <Github size={18} /> Register with GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Already have an account? <Link href="/login" className="text-cyan-500 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}