"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Image as ImageIcon, X, Check, 
  Globe, ShieldCheck, Zap 
} from "lucide-react";
import { postToAllPlatforms } from "@/app/actions/post-action";

const ALL_APPS = [
  { id: "Facebook", icon: "f", color: "bg-[#1877F2]" },
  { id: "Instagram", icon: "i", color: "bg-[#E1306C]" },
  { id: "Telegram", icon: "t", color: "bg-[#0088cc]" },
  { id: "WhatsApp", icon: "w", color: "bg-[#25D366]" },
  { id: "X", icon: "x", color: "bg-black" },
  { id: "YouTube", icon: "y", color: "bg-[#FF0000]" },
  { id: "LinkedIn", icon: "l", color: "bg-[#0077B5]" },
  { id: "TikTok", icon: "tk", color: "bg-black" },
  { id: "Reddit", icon: "r", color: "bg-[#FF4500]" },
  { id: "Snapchat", icon: "s", color: "bg-[#FFFC00]" },
  { id: "Pinterest", icon: "p", color: "bg-[#BD081C]" },
];

export default function Composer({ connectedAccounts }: { connectedAccounts: any[] }) {
  const [content, setContent] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleApp = (id: string) => {
    setSelectedApps(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    if (!content && !media) return alert("Please add content");
    if (selectedApps.length === 0) return alert("Select at least one target");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);
    formData.append("selectedPlatforms", JSON.stringify(selectedApps));

    await postToAllPlatforms(formData);
    setLoading(false);
    alert("Mission Accomplished! 🚀");
    setContent(""); setMedia(null); setPreview(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* 📟 Glass Composer Panel */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/5 shadow-2xl">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's the mission today? Write here..."
          className="w-full h-40 bg-white/5 rounded-[2rem] p-8 text-lg font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 border-none resize-none transition-all mb-6"
        />

        {preview && (
          <div className="relative mb-6 h-40 rounded-3xl overflow-hidden border border-white/10">
             <img src={preview} className="w-full h-full object-cover" />
             <button onClick={() => {setMedia(null); setPreview(null);}} className="absolute top-3 right-3 bg-red-500 p-2 rounded-xl"><X size={14}/></button>
          </div>
        )}

        {/* 📱 Target App Selection (10+ Apps) */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Target Systems</p>
          <div className="flex flex-wrap gap-3">
            {ALL_APPS.map((app) => (
              <button key={app.id} onClick={() => toggleApp(app.id)} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${selectedApps.includes(app.id) ? 'scale-110 ring-2 ring-blue-500' : 'opacity-20 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                <div className={`${app.color} w-full h-full rounded-xl flex items-center justify-center text-white font-black text-[10px] uppercase`}>{app.icon}</div>
                {selectedApps.includes(app.id) && <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5"><Check size={8} strokeWidth={4}/></div>}
              </button>
            ))}
          </div>
        </div>

        {/* 🔗 Connected Destinations (Real Data) */}
        <div className="mb-8 p-6 bg-black/20 rounded-[2rem] border border-white/5">
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-4">Active Links</p>
          <div className="space-y-2">
            {connectedAccounts.map((acc: any) => (
              <div key={acc.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-[8px] font-black">{acc.platform[0]}</div>
                  <span className="text-[11px] font-bold text-slate-300">{acc.accountName}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
            ))}
            {connectedAccounts.length === 0 && <p className="text-[10px] text-slate-600 text-center italic">No accounts linked. Visit 'Connections' to start.</p>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl transition-all">
            <ImageIcon className="text-blue-500" size={18} />
            <span className="text-[10px] font-black uppercase text-slate-400">Media</span>
            <input type="file" className="hidden" onChange={handleMediaChange} />
          </label>
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 flex items-center gap-2">
            {loading ? "Syncing..." : <><Send size={16}/> Dispatch</>}
          </button>
        </div>
      </div>

      {/* 🛰️ Live Preview */}
      <div className="w-full lg:w-[350px] sticky top-8 bg-slate-900 border border-white/10 rounded-[3rem] p-2 shadow-2xl">
         <div className="bg-[#1C2636] rounded-[2.5rem] overflow-hidden">
            <div className="p-5 flex items-center gap-3 border-b border-white/5">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">PJ</div>
               <p className="text-[11px] font-black uppercase">PostJet Preview</p>
            </div>
            <div className="aspect-square bg-black/40 flex items-center justify-center overflow-hidden">
               {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Zap className="text-white/5" size={80} />}
            </div>
            <div className="p-6 h-32">
               <p className="text-xs font-medium text-slate-400 leading-relaxed italic">{content || "Waiting for signal..."}</p>
            </div>
         </div>
      </div>
    </div>
  );
}