"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase'; 
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Registration Successful! Check your email for confirmation.");
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col items-center justify-center p-6">
      <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white mb-8 uppercase transition-all group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1" /> Back to Home
      </button>

      <div className="w-full max-w-[400px] bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-[#00D1FF] text-black rounded-2xl flex items-center justify-center font-black mx-auto mb-4">P</div>
           <h2 className="text-2xl font-black uppercase italic">Join PostJet</h2>
        </div>

        {errorMsg && <div className="mb-4 text-red-400 text-xs font-bold text-center">{errorMsg}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-cyan-500/50" onChange={(e) => setFullName(e.target.value)} />
          <input type="email" placeholder="Email" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-cyan-500/50" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-cyan-500/50" onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-[#00D1FF] text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:shadow-cyan-500/20 shadow-lg transition-all uppercase">
            {loading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}