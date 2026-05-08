"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, Image as ImageIcon, 
  Send, Calendar, Loader2, CheckCircle2, AlertCircle, Globe, Check, User as UserIcon,
  Zap, LogOut
} from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useDashboard } from '@/hooks/useDashboard';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';

const platforms = [
  { name: 'Instagram', logo: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
  { name: 'Facebook', logo: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
  { name: 'LinkedIn', logo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  { name: 'Twitter (X)', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png' },
  { name: 'WhatsApp', logo: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
  { name: 'YouTube', logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { name: 'TikTok', logo: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' },
  { name: 'Pinterest', logo: 'https://cdn-icons-png.flaticon.com/512/145/145808.png' },
  { name: 'Reddit', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111589.png' },
  { name: 'Discord', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111370.png' },
  { name: 'Telegram', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png' },
  { name: 'Slack', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
  { name: 'Medium', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png' },
  { name: 'Google Biz', logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
  { name: 'Threads', logo: 'https://cdn-icons-png.flaticon.com/512/11520/11520444.png' },
  { name: 'Resend', logo: 'https://resend.com/static/favicon.ico' },
  { name: 'Devo.io', logo: 'https://cdn-icons-png.flaticon.com/512/606/606200.png' }
];

export default function DashboardPage() {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const { 
    postContent, setPostContent, isPosting, showSuccess, 
    platformStatuses, showStatusModal, setShowStatusModal, handlePostSubmit 
  } = useDashboard();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setUserProfile({ ...data, email: user.email });
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleUpgrade = async (variantId: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userProfile.id, 
          userEmail: userProfile.email,
          variantId: variantId 
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Checkout failed. Please try again.");
    }
  };

  const toggleApp = (appName: string) => {
    setSelectedApps(prev => 
      prev.includes(appName) ? prev.filter(a => a !== appName) : [...prev, appName]
    );
  };

  const filteredPlatforms = platforms.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      {/* --- STATUS MODAL --- */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl border border-slate-100 text-slate-800">
            <h3 className="text-xl font-black mb-6 italic uppercase tracking-tighter">Blasting Status</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {selectedApps.map((app) => {
                const info = platformStatuses[app] || { status: 'pending' };
                return (
                  <div key={app} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="font-bold text-sm">{app}</span>
                    <div className="flex items-center gap-2">
                      {info.status === 'loading' && <Loader2 className="animate-spin text-indigo-600" size={18} />}
                      {info.status === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
                      {info.status === 'error' && <AlertCircle className="text-red-500" size={20} />}
                      {info.status === 'pending' && <span className="text-[10px] font-bold text-slate-400">Waiting</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {!isPosting && (
              <button onClick={() => setShowStatusModal(false)} className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-[24px] hover:bg-indigo-600 transition-all">
                DONE
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">
                {userProfile?.plan_type === 'Pro' ? '🔥 PRO PLAN ACTIVE' : 'Trial Version'}
            </p>
            <h1 className="text-2xl md:text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
              {userProfile?.full_name || "PostJet User"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {userProfile?.plan_type !== 'Pro' && (
                <button 
                onClick={() => handleUpgrade('YOUR_VARIANT_ID')}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-orange-200 hover:scale-105 transition-all"
                >
                <Zap size={14} fill="white" /> Upgrade
                </button>
            )}

            <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
            </button>

            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-slate-200">
                {userProfile?.full_name?.charAt(0) || <UserIcon size={24} />}
            </div>
          </div>
        </div>

        {/* --- PLATFORMS --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div> Target Platforms
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {filteredPlatforms.map((app) => (
              <button 
                key={app.name}
                onClick={() => toggleApp(app.name)}
                className={`group relative w-16 h-20 md:w-20 md:h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedApps.includes(app.name) ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[22px] flex items-center justify-center border-2 ${
                  selectedApps.includes(app.name) ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-white border-slate-100'
                }`}>
                  <img src={app.logo} alt={app.name} className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                </div>
                <span className={`text-[9px] font-black uppercase ${selectedApps.includes(app.name) ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* --- COMPOSE & PREVIEW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-[48px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             {showSuccess && (
                <div className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center z-50 animate-in zoom-in duration-500">
                  <CheckCircle2 className="text-white mb-2" size={60} />
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Blast Launched!</h2>
                </div>
              )}
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                 <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">New Content</h2>
                 <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                    <ImageIcon size={22} />
                 </button>
                 <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setSelectedMedia(URL.createObjectURL(file)); setSelectedFile(file); }
                 }} />
              </div>
              <form onSubmit={(e) => handlePostSubmit(e, selectedApps, selectedFile)} className="space-y-6">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Drop your message here..."
                  className="w-full h-64 bg-[#F9FBFF] border-none rounded-[32px] p-8 outline-none focus:ring-4 focus:ring-indigo-100/50 text-slate-800 text-lg font-medium shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={isPosting || selectedApps.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-black py-4 rounded-[20px] transition-all flex items-center justify-center gap-3 uppercase text-sm"
                >
                  {isPosting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {isPosting ? "BLASTING..." : `LAUNCH BLAST`}
                </button>
              </form>
          </div>

          <div className="lg:col-span-5 bg-white rounded-[48px] p-8 border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-400 mb-8 uppercase tracking-widest italic">Live Preview</h3>
              <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-[40px] border border-slate-100 p-6 shadow-inner">
                 <div className="w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 max-w-[320px]">
                    <div className="p-5 flex items-center gap-3 border-b border-slate-50">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-xs">PJ</div>
                       <div className="flex-grow">
                          <p className="text-xs font-black text-slate-800">{userProfile?.full_name || "PostJet User"}</p>
                          <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">Sync Active</p>
                       </div>
                    </div>
                    <div className="p-6 text-slate-600 text-[13px] leading-relaxed min-h-[140px] break-words">
                       {postContent || <span className="text-slate-300 italic">Type something to preview...</span>}
                    </div>
                    {selectedMedia && <img src={selectedMedia} className="w-full h-52 object-cover" alt="preview" />}
                 </div>
              </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
        <p className="text-[10px] font-black uppercase tracking-widest">© 2026 POSTJET PRO - ALL RIGHTS RESERVED</p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-tighter">
          <a href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          <a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="https://tawk.to" target="_blank" className="hover:text-indigo-600 transition-colors">Support Chat</a>
        </div>
      </footer>
    </div>
  );
}