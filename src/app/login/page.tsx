"use client";
import React from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">PostJet</h1>
          <p className="text-slate-500 mt-2 text-sm">Elevate your social media presence</p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="name@company.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="px-4 text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => signIn('google')}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-medium text-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </button>
          <button 
            onClick={() => signIn('github')}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-medium text-sm"
          >
            <img src="https://github.com/favicon.ico" className="w-4 h-4" alt="Github" />
            GitHub
          </button>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          Don't have an account? <span className="text-blue-600 font-bold cursor-pointer">Sign up for free</span>
        </p>
      </div>
    </div>
  );
}