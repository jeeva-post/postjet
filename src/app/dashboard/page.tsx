"use client";
import React, { useState } from 'react';
import { 
  Send, LayoutDashboard, Share2, Settings, 
  CheckCircle2, Plus, Image as ImageIcon,
  Facebook, Instagram, Send as TelegramIcon,
  BarChart3, CreditCard, Bell, Search, User,
  Twitter, AtSign, ChevronRight, Eye
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SaaSPremiumDashboard() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Post published across all platforms!');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0F172A] text-white p-6 flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/40">
            <Send size={24} className="-rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">PostJet</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <NavItem icon={<Plus size={20}/>} label="Create Post" />
          <NavItem icon={<Share2 size={20}/>} label="Connected Apps" />
          <NavItem icon={<BarChart3 size={20}/>} label="Analytics" />
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account</p>
          </div>
          <NavItem icon={<CreditCard size={20}/>} label="Billing & Plans" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="mt-auto bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Post Credits</span>
            <span className="text-blue-400 font-bold">12 / 50</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[24%]" />
          </div>
          <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-all">
            Upgrade Pro
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg w-64">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search posts..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Jeevan Kumar</p>
                <p className="text-[10px] text-slate-500 font-medium">Starter Plan</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                JK
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Create Campaign</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SYSTEM ONLINE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              {/* Left Column: Editor */}
              <div className="xl:col-span-7 space-y-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">01</div>
                     <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Post Details</h3>
                  </div>

                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe what's happening..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl min-h-[200px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-800 text-lg leading-relaxed resize-none"
                  />

                  <div className="mt-6 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
                    <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-blue-50 transition-all">
                      <Plus size={32} className="text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <p className="mt-4 font-bold text-slate-600 uppercase tracking-tighter text-xs">Drop your visuals here</p>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">02</div>
                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Channels</h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">SELECT AT LEAST ONE</span>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <ChannelIcon icon={<Facebook size={20}/>} label="FB Page" color="hover:bg-blue-600" />
                      <ChannelIcon icon={<Instagram size={20}/>} label="Insta" color="hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" />
                      <ChannelIcon icon={<AtSign size={20}/>} label="Threads" color="hover:bg-black" />
                      <ChannelIcon icon={<TelegramIcon size={20}/>} label="Telegram" color="hover:bg-sky-500" />
                   </div>
                </div>
              </div>

              {/* Right Column: Preview */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-[8px] border-slate-800 relative overflow-hidden min-h-[500px]">
                   <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-center">
                      <div className="w-16 h-1 bg-slate-800 rounded-full" />
                   </div>
                   
                   <div className="bg-white mt-10 rounded-2xl overflow-hidden min-h-[400px]">
                      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                         <div className="w-8 h-8 bg-slate-200 rounded-full" />
                         <div>
                            <div className="w-20 h-2 bg-slate-200 rounded-full mb-1" />
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
                         </div>
                      </div>
                      <div className="p-6">
                        <p className={`text-slate-800 whitespace-pre-wrap ${content ? 'opacity-100' : 'opacity-20'}`}>
                          {content || "Your preview will appear here as you type..."}
                        </p>
                        <div className="mt-8 w-full aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                           <ImageIcon size={48} className="text-slate-200" />
                        </div>
                      </div>
                   </div>

                   <div className="mt-6 flex justify-center">
                      <button 
                        onClick={handlePublish}
                        disabled={loading}
                        className={`px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 ${loading ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                      >
                        {loading ? 'Processing...' : 'Blast Content'}
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-blue-400 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
                         <BarChart3 size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-black uppercase tracking-tight">Best Posting Time</p>
                         <p className="text-xs text-slate-500">Today at 6:45 PM</p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
      <span className={`${active ? 'text-white' : 'group-hover:text-blue-400'} transition-colors`}>{icon}</span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </div>
  );
}

function ChannelIcon({ icon, label, color }: any) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer transition-all hover:shadow-md hover:scale-105 group active:scale-95`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white text-slate-400 shadow-sm border border-slate-100 transition-all group-hover:text-white ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{label}</span>
    </div>
  );
}