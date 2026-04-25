"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Sparkles, Send, Globe, Loader2 } from "lucide-react";
import { getUserAccounts } from "../actions/account-actions"; 
import { generateAICaption } from "../actions/ai-actions";

const FBLogo = () => (<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#1877F2"/><path d="M29.5 24H25.5V38H20V24H17V19.5H20V16.8C20 13.1 22.1 11 25.5 11C27.1 11 28.5 11.1 28.9 11.2V15.2H26.5C24.8 15.2 24.5 16.1 24.5 17.2V19.5H29L28.5 24H29.5Z" fill="white"/></svg>);
const InstaLogo = () => (<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#ig)"/><path d="M24 14.5C18.75 14.5 14.5 18.75 14.5 24C14.5 29.25 18.75 33.5 24 33.5C29.25 33.5 33.5 29.25 33.5 24C33.5 18.75 29.25 14.5 24 14.5ZM24 30C20.69 30 18 27.31 18 24C18 20.69 20.69 18 24 18C27.31 18 30 20.69 30 24C30 27.31 27.31 30 24 30ZM33.5 16.5C33.5 17.6 32.6 18.5 31.5 18.5Z" fill="white"/><defs><radialGradient id="ig" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 36) rotate(-45) scale(40)"><stop stopColor="#FED011"/><stop offset="0.5" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/></radialGradient></defs></svg>);
const WALogo = () => (<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#25D366"/><path d="M34.5 29.5C34.2 30.5 32.5 31.4 31.5 31.6C30.8 31.8 29.8 31.9 26.8 30.6C23 29 20.5 25.1 20.3 24.9C18.6 20.6 20.1 17.1 21.4 16.6H22.4L23.3 17.3C24.4 20 24.5 20.2L26.5 28.3C28.5 30.1 30.7 30.9L35.1 28.6L34.5 29.5Z" fill="white"/></svg>);

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const load = async () => {
    setIsSyncing(true);
    const data = await getUserAccounts();
    setAccounts(data || []);
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleAI = async () => {
    if (!content) return alert("Enter a topic first!");
    setIsAiLoading(true);
    const res = await generateAICaption(content);
    if (res.success) setContent(res.text);
    else alert(res.text);
    setIsAiLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 md:p-12 text-slate-900">
      <header className="mb-10 flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Mission Control</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Commander Jeevan</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase shadow-sm active:scale-95 transition-all">
          <RefreshCcw size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Refresh"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[ {id:"Facebook", key:"facebook", Icon:FBLogo}, {id:"Instagram", key:"instagram", Icon:InstaLogo}, {id:"WhatsApp", key:"whatsapp", Icon:WALogo} ].map((p) => {
          const isConnected = accounts.some(acc => acc.platform?.toLowerCase() === p.key);
          return (
            <div key={p.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all duration-500">
              <div className="flex justify-between items-start mb-6"><p.Icon /><span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${isConnected ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>{isConnected ? 'Active' : 'Offline'}</span></div>
              <div className="flex justify-between items-end"><h4 className="font-black text-sm uppercase">{p.id}</h4><button onClick={() => window.location.href=`/api/auth/social/${p.key}`} className={`p-3 rounded-xl ${isConnected ? 'bg-slate-50 text-slate-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-90 transition-all'}`}>{isConnected ? <CheckCircle2 size={16}/> : <Zap size={16}/>}</button></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm focus-within:border-blue-100 transition-all">
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Type a topic and let AI write your post..." className="w-full h-64 bg-transparent border-none focus:ring-0 text-lg font-medium resize-none placeholder:text-slate-200 italic" />
          <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
            <button onClick={handleAI} disabled={isAiLoading} className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-5 py-2.5 rounded-full hover:bg-blue-100 transition-all disabled:opacity-50">
              {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {isAiLoading ? "AI Writing..." : "AI Magic"}
            </button>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-100 hover:-translate-y-1 transition-all flex items-center gap-2 active:scale-95"><Send size={14}/> Broadcast</button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-white italic">P</div>
            <div><p className="text-sm font-black">Commander Jeevan</p><p className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">Live • <Globe size={10} /></p></div>
          </div>
          <div className="p-8"><p className="text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">{content || <span className="text-slate-200 italic">Your transmission preview...</span>}</p></div>
          <div className="bg-slate-50/30 p-4 border-t border-slate-50 flex justify-around text-slate-300 text-[8px] font-black uppercase tracking-[0.2em]"><span>Like</span><span>Comment</span><span>Share</span></div>
        </div>
      </div>
    </div>
  );
}