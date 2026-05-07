"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserData({
          // User metadata nundi name thechukuntundhi
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || "PostJet User",
          email: user.email || "",
          // Profile pic unte metadata nundi vasthundi, lekapothe null
          avatar: user.user_metadata?.avatar_url || ""
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* 1. SEARCH BAR - Design as it is */}
      <div className="relative w-96 group hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search for analytics..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-400/30 transition-all placeholder:text-slate-600"
        />
      </div>

      {/* 2. LOGO/BRAND (Mobile Only) */}
      <div className="md:hidden font-black text-xl italic text-cyan-500">PJ</div>

      {/* 3. PROFILE & ACTIONS */}
      <div className="flex items-center gap-5">
        
        {/* Notification Icon */}
        <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#020617]"></span>
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-4 pl-5 border-l border-white/10 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-bold text-white tracking-tight leading-tight">
              {userData?.name || "Loading..."}
            </h4>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">
              Business Account
            </p>
          </div>

          <div className="relative">
            {userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-cyan-500/20">
                {userData?.name.charAt(0).toUpperCase() || <User size={18}/>}
              </div>
            )}
          </div>

          {/* Logout Button - Compact Design */}
          <button 
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}