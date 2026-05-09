"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, Image as ImageIcon, 
  Send, Calendar, Loader2, CheckCircle2, AlertCircle, Globe, Check, User as UserIcon,
  Zap, LogOut, ChevronRight
} from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useDashboard } from '@/hooks/useDashboard';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';

const platforms = [
  { name: 'Facebook', id: 'facebook', logo: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
  { name: 'Instagram', id: 'instagram', logo: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
  { name: 'LinkedIn', id: 'linkedin', logo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  { name: 'Twitter (X)', id: 'twitter', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png' },
  { name: 'WhatsApp', id: 'whatsapp', logo: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
  { name: 'YouTube', id: 'youtube', logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { name: 'TikTok', id: 'tiktok', logo: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' },
  { name: 'Pinterest', id: 'pinterest', logo: 'https://cdn-icons-png.flaticon.com/512/145/145808.png' },
  { name: 'Reddit', id: 'reddit', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111589.png' },
  { name: 'Discord', id: 'discord', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111370.png' },
  { name: 'Telegram', id: 'telegram', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png' },
  { name: 'Slack', id: 'slack', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
  { name: 'Medium', id: 'medium', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png' },
  { name: 'Google Biz', id: 'googlebiz', logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
  { name: 'Threads', id: 'threads', logo: 'https://cdn-icons-png.flaticon.com/512/11520/11520444.png' },
  { name: 'Resend', id: 'resend', logo: 'https://resend.com/static/favicon.ico' },
  { name: 'Devo.io', id: 'devo', logo: 'https://cdn-icons-png.flaticon.com/512/606/606200.png' }
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
  
  // --- SaaS State ---
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isFetchingPages, setIsFetchingPages] = useState(false);

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

  // Connect Platform Function
  const connectApp = (platformId: string) => {
    window.location.href = `/api/connect/${platformId}`;
  };

  // SaaS: Fetch Pages Logic
  const fetchPlatformPages = async (platform: string) => {
    setIsFetchingPages(true);
    try {
      // Tokens database nundi fetch chese logic ikkada untundi
      const res = await fetch('/api/pages/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, accessToken: 'USER_OAUTH_TOKEN' }) 
      });
      const data = await res.json();
      setPagesList(data);
    } catch (error) {
      console.error("Failed to fetch pages");
    } finally {
      setIsFetchingPages(false);
    }
  };

  const toggleApp = (appName: string, platformId: string) => {
    setSelectedApps(prev => {
        const isSelected = prev.includes(appName);
        if (!isSelected) {
            fetchPlatformPages(platformId); // Platform click cheyagane pages load avthayi
            return [...prev, appName];
        }
        return prev.filter(a => a !== appName);
    });
  };

  const togglePageSelection = (pageId: string) => {
    setSelectedPageIds(prev => 
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
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
            <h3 className="text-xl font-black mb-6 italic uppercase tracking-tighter text-indigo-600">PostJet live Blaster</h3>
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
                      {info.status === 'pending' && <span className="text-[10px] font-bold text-slate-400 italic">READY</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {!isPosting && (
              <button onClick={() => setShowStatusModal(false)} className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-[24px] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100">
                DONE
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-indigo-200">
                {userProfile?.full_name?.charAt(0) || "P"}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">
                    {userProfile?.plan_type === 'Pro' ? '🔥 PRO ACTIVE' : 'SaaS Trial'}
                </p>
                <h1 className="text-2xl md:text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
                {userProfile?.full_name || "PostJet Admin"}
                </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* --- PLATFORMS SELECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 italic">
              <Zap size={20} className="text-indigo-600" fill="currentColor" /> Target Apps
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm">
            {filteredPlatforms.map((app) => (
              <button 
                key={app.name}
                onClick={() => toggleApp(app.name, app.id)}
                className={`group relative w-16 h-20 md:w-20 md:h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedApps.includes(app.name) ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'
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
            <button onClick={() => connectApp('facebook')} className="w-16 h-20 md:w-20 md:h-24 border-2 border-dashed border-slate-200 rounded-[22px] flex items-center justify-center text-slate-300 hover:border-indigo-400 hover:text-indigo-400 transition-all">
                <PlusCircle size={24} />
            </button>
          </div>
        </section>

        {/* --- SAAS: PAGES LIST SELECTION --- */}
        {pagesList.length > 0 && (
            <section className="animate-in slide-in-from-bottom-5 duration-500">
                 <h2 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-[0.2em] italic">Select Pages / Accounts</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pagesList.map(page => (
                        <div 
                            key={page.id}
                            onClick={() => togglePageSelection(page.id)}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                selectedPageIds.includes(page.id) 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' 
                                : 'bg-white border-white text-slate-800 shadow-sm hover:border-slate-100'
                            }`}
                        >
                            <span className="font-bold text-sm truncate">{page.name}</span>
                            {selectedPageIds.includes(page.id) ? <Check size={18} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-100"></div>}
                        </div>
                    ))}
                 </div>
            </section>
        )}

        {/* --- COMPOSE & PREVIEW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          <div className="lg:col-span-7 bg-white rounded-[48px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              {showSuccess && (
                <div className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center z-50 animate-in zoom-in duration-500">
                  <CheckCircle2 className="text-white mb-2" size={60} />
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">SUCCESSFUL!</h2>
                </div>
              )}
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Content Engine</h2>
                 <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <ImageIcon size={22} />
                    </button>
                    <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { setSelectedMedia(URL.createObjectURL(file)); setSelectedFile(file); }
                    }} />
                 </div>
              </div>
              
              <form onSubmit={(e) => handlePostSubmit(e, selectedApps, selectedFile)} className="space-y-6">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's the blast today?"
                  className="w-full h-72 bg-slate-50 border-none rounded-[32px] p-8 outline-none focus:ring-4 focus:ring-indigo-100/30 text-slate-800 text-lg font-medium shadow-inner resize-none"
                />
                
                <div className="flex items-center gap-4">
                    <button 
                    type="submit"
                    disabled={isPosting || selectedApps.length === 0}
                    className="flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-5 rounded-[24px] transition-all flex items-center justify-center gap-3 uppercase text-sm shadow-xl shadow-indigo-100"
                    >
                    {isPosting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {isPosting ? "BLASTING..." : `LAUNCH TO ${selectedPageIds.length || selectedApps.length} TARGETS`}
                    </button>
                    
                    <button type="button" className="p-5 bg-slate-900 text-white rounded-[24px] hover:bg-slate-800 transition-all">
                        <Calendar size={20} />
                    </button>
                </div>
              </form>
          </div>

          {/* PREVIEW PANEL */}
          <div className="lg:col-span-5 bg-slate-900 rounded-[48px] p-8 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Globe size={150} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-indigo-400 mb-8 uppercase tracking-widest italic z-10">Dynamic Preview</h3>
              <div className="flex-grow flex items-center justify-center z-10">
                 <div className="w-full bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-[320px] animate-in fade-in zoom-in duration-700">
                    <div className="p-5 flex items-center gap-3 border-b border-slate-50">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs">PJ</div>
                       <div className="flex-grow">
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{userProfile?.full_name || "PostJet User"}</p>
                          <p className="text-[8px] text-indigo-500 font-bold uppercase tracking-widest">PostJet SaaS System</p>
                       </div>
                       <ChevronRight size={14} className="text-slate-300" />
                    </div>
                    <div className="p-6 text-slate-600 text-[13px] leading-relaxed min-h-[140px] break-words font-medium">
                       {postContent || <span className="text-slate-300 italic">Start typing to see the magic...</span>}
                    </div>
                    {selectedMedia && (
                        <div className="px-4 pb-4">
                            <img src={selectedMedia} className="w-full h-48 object-cover rounded-[24px]" alt="preview" />
                        </div>
                    )}
                    <div className="p-4 bg-slate-50 flex justify-around">
                        <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                        <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                        <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                    </div>
                 </div>
              </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
        <p className="text-[10px] font-black uppercase tracking-widest italic">© 2026 POSTJET SaaS PRO - THE FUTURE OF BLASTING</p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-tighter">
          <a href="#" className="hover:text-indigo-600">Privacy</a>
          <a href="#" className="hover:text-indigo-600">Support</a>
        </div>
      </footer>
    </div>
  );
}