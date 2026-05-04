"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchProvider } from '@/context/SearchContext'; // Context wrapper
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  LogOut, 
  MessageSquare,
  Search,
  Bell
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleFinalLogout = () => {
    // Session clear chesi login ki redirect chesthunnam
    router.push('/login');
  };

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[#020617] text-white">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full bg-[#020617] z-50">
          <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-cyan-500/20">
              P
            </div>
            <span className="text-xl font-bold italic tracking-tighter text-white">PostJet</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/dashboard/posts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
              <MessageSquare size={20} /> Posts
            </Link>
            <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
              <CreditCard size={20} /> Billing
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
              <Settings size={20} /> Settings
            </Link>
          </nav>

          {/* SIDEBAR LOGOUT BUTTON */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 ml-64">
          
          {/* HEADER (Sticky) */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-40">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search platforms or posts..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500/50 transition-all text-white" 
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2.5 text-slate-400 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#020617]"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none mb-1">Admin User</p>
                  <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-tight">Premium Plan</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold text-sm">
                  AD
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="min-h-[calc(100vh-80px)] relative">
            {children}
          </div>
        </main>

        {/* --- LOGOUT CONFIRMATION MODAL --- */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[32px] max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
                <LogOut size={32} />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2 italic">Logout?</h3>
              <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">Are you sure you want to log out of PostJet?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)} 
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFinalLogout} 
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-600/20 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SearchProvider>
  );
}