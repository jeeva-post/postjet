"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Navigation kosam idi avasaram
import { Mail, Lock, ArrowRight, Github, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Ikkada real backend unnappudu API call chestham. 
    // Ippudu manam direct ga dashboard ki pampisthunnam.
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500); // 1.5 seconds loading effect kosam
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-bold text-black text-2xl shadow-lg shadow-cyan-500/20">P</div>
          <span className="text-2xl font-bold text-white tracking-tighter italic">PostJet</span>
        </div>

        <div className="bg-[#0f172a] border border-white/5 rounded-[32px] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm font-medium">Log in to manage your social presence.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required type="email" placeholder="name@example.com" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/60" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[10px] font-bold text-cyan-500 hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required type="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-all focus:bg-black/60" />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-900 disabled:text-slate-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <> <Loader2 className="animate-spin" size={18} /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8">
            <button type="button" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3">
              <Github size={20} /> Continue with GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          New to PostJet? <Link href="/signup" className="text-cyan-500 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}