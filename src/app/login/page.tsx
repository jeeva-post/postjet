"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col items-center justify-center p-6">
      <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white mb-8 uppercase transition-all">
        <ArrowLeft size={14} /> Back to Home
      </button>

      <div className="w-full max-w-[400px] bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black mx-auto mb-4">P</div>
           <h2 className="text-2xl font-black uppercase italic tracking-tighter">Login to PostJet</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50" onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-indigo-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-lg transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
          </button>
        </form>
        <p className="text-center mt-6 text-[10px] text-slate-500 font-black uppercase tracking-widest cursor-pointer hover:text-white" onClick={() => router.push('/register')}>
            New here? Create Account
        </p>
      </div>
    </div>
  );
}