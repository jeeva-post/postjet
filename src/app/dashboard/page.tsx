"use client";

import React, { useState, useRef } from 'react';
import { 
  PlusCircle, Image as ImageIcon, 
  Eye, Smartphone, Smile, Send, Calendar, Loader2, X, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useDashboard } from '@/hooks/useDashboard';

const platforms = [
  { name: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
  { name: 'Facebook', color: 'bg-blue-600' },
  { name: 'LinkedIn', color: 'bg-blue-700' },
  { name: 'Twitter (X)', color: 'bg-black' },
  { name: 'Threads', color: 'bg-neutral-800' },
  { name: 'YouTube', color: 'bg-red-600' },
  { id: "slack", name: "Slack", icon: "🚀", color: 'bg-indigo-500' },
  { name: 'TikTok', color: 'bg-black' },
  { name: 'Pinterest', color: 'bg-red-700' },
  { name: 'Reddit', color: 'bg-orange-600' },
  { name: 'Discord', color: 'bg-indigo-600' },
  { name: 'WhatsApp', color: 'bg-green-500' },
  { name: 'Telegram', color: 'bg-sky-500' },
  { name: 'Medium', color: 'bg-black' },
  { name: 'Google Biz', color: 'bg-blue-500' },
  // --- New Professional Tools Added ---
  { name: 'Resend', color: 'bg-zinc-100 text-black' },
  { name: 'Devo.io', color: 'bg-indigo-900' },
];

export default function DashboardPage() {
  const { searchQuery } = useSearch();
  const { 
    postContent, setPostContent, isPosting, showSuccess, 
    platformStatuses, showStatusModal, setShowStatusModal, handlePostSubmit 
  } = useDashboard();

  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleApp = (appName: string) => {
    setSelectedApps(prev => 
      prev.includes(appName) ? prev.filter(a => a !== appName) : [...prev, appName]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMedia(url);
      setSelectedFile(file);
    }
  };

  const filteredPlatforms = platforms.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-700 relative">
      
      {/* --- LIVE STATUS POP-UP --- */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-cyan-500/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tighter">BLASTING ENGINE</h3>
              {isPosting && <Loader2 className="animate-spin text-cyan-500" />}
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(platformStatuses).map(([app, info]) => (
                <div key={app} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="font-bold text-slate-300">{app}</span>
                  <div className="flex items-center gap-2">
                    {info.status === 'loading' && <span className="text-cyan-500 text-xs animate-pulse">Processing...</span>}
                    {info.status === 'success' && <CheckCircle2 className="text-green-500" size={18} />}
                    {info.status === 'error' && (
                      <div className="group relative">
                        <AlertCircle className="text-red-500" size={18} />
                        <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-red-500 text-white text-[10px] p-2 rounded whitespace-nowrap z-10">
                          {info.message}
                        </span>
                      </div>
                    )}
                    {info.status === 'pending' && <span className="text-slate-600 text-xs italic">Queued</span>}
                  </div>
                </div>
              ))}
            </div>

            {!isPosting && (
              <button 
                onClick={() => setShowStatusModal(false)}
                className="w-full mt-8 bg-cyan-500 text-black font-black py-3 rounded-xl hover:bg-cyan-400 transition-all"
              >
                DONE
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight italic">Welcome Back!</h2>
        <p className="text-slate-500 mt-1">Manage your global social presence from one single command center.</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* WRITING BOARD */}
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
          
          {showSuccess && (
            <div className="absolute inset-0 bg-cyan-500 flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300">
              <Send className="text-white mb-2" size={40} />
              <h2 className="text-xl font-black text-white italic tracking-tighter">POST JET BLASTED!</h2>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2 italic">
              <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span> Compose Content
            </h3>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
            >
              <ImageIcon size={20} />
            </button>
            <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={handleFileUpload} />
          </div>

          <form onSubmit={(e) => handlePostSubmit(e, selectedApps, selectedFile)} className="flex flex-col gap-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening? Write your post here..."
              className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-5 outline-none focus:ring-1 focus:ring-cyan-500/50 text-slate-200 resize-none text-lg leading-relaxed"
            />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Calendar size={16} className="text-cyan-500" /> 
                  <span>Schedule this post?</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsScheduling(!isScheduling)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isScheduling ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isScheduling ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
               <button type="button" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"><Smile size={22}/></button>
               <button 
                type="submit"
                disabled={isPosting || selectedApps.length === 0}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-extrabold px-10 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
               >
                 {isPosting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                 {isPosting ? "Blasting..." : `Blast to ${selectedApps.length || '...'} Apps`}
               </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="bg-[#030816] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-[340px] bg-[#0f172a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-black text-sm">PJ</div>
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">PostJet Official</p>
                  <p className="text-[10px] text-slate-500 italic uppercase">Preview Mode</p>
                </div>
              </div>
              
              <div className="px-4 py-6 min-h-[80px] text-[14px] text-slate-300 whitespace-pre-wrap">
                {postContent || "Your content will appear here..."}
              </div>

              {selectedMedia ? (
                <img src={selectedMedia} className="w-full aspect-square object-cover" alt="preview" />
              ) : (
                <div className="w-full aspect-video bg-white/5 flex flex-col items-center justify-center gap-3">
                  <ImageIcon size={40} className="text-white/10"/>
                </div>
              )}
            </div>
        </div>
      </section>

      {/* PLATFORMS GRID */}
      <section className="pt-4 pb-12">
        <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
          <PlusCircle size={20} className="text-cyan-500" /> 
          Select Platforms ({selectedApps.length})
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filteredPlatforms.map((app, index) => (
            <div 
              key={index} 
              onClick={() => toggleApp(app.name)}
              className={`group relative p-4 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 cursor-pointer shadow-lg border-2 ${
                selectedApps.includes(app.name) 
                ? 'border-cyan-500 bg-cyan-500/10 shadow-cyan-500/10' 
                : 'border-white/5 bg-[#0f172a]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center font-bold text-xl shadow-lg`}>
                {app.icon ? app.icon : app.name.charAt(0)}
              </div>
              <p className="font-medium text-slate-200 text-sm">{app.name}</p>
              {selectedApps.includes(app.name) && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center">
                   <CheckCircle2 size={10} className="text-black" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}