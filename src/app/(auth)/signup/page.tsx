"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Supabase client import
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // --- SUPABASE SIGNUP LOGIC ---
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          display_name: name,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      setIsSuccess(true);
      // Success అయితే 2 సెకన్ల తర్వాత డాష్‌బోర్డ్‌కి పంపిస్తున్నాం
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-cyan-500 rounded-[22px] flex items-center justify-center font-black text-black text-3xl mb-4 shadow-xl shadow-cyan-500/20 -rotate-3">
            P
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">Create Account</h1>
          <p className="text-slate-500 font-medium mt-2 text-center">Join PostJet to automate 15+ platforms</p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#0f172a] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full"></div>
          
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center text-center animate-in fade-in zoom-in">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to PostJet!</h2>
              <p className="text-slate-400">Account created successfully. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5 relative z-10">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="name@company.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input 
                    name="password"
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center relative z-10">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account? {' '}
              <Link href="/login" className="text-white hover:text-cyan-400 font-bold transition-colors">Log In</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-[11px] mt-8 font-medium uppercase tracking-widest">
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}