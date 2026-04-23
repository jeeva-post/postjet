"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Image as ImageIcon, X, Check, 
  ChevronDown, Globe, ShieldCheck, Zap 
} from "lucide-react";
import { postToAllPlatforms } from "@/app/actions/post-action";

const ALL_PLATFORMS = [
  { id: "Facebook", icon: "f", color: "bg-[#1877F2]" },
  { id: "Instagram", icon: "i", color: "bg-[#E1306C]" },
  { id: "X", icon: "x", color: "bg-black" },
  { id: "LinkedIn", icon: "l", color: "bg-[#0077B5]" },
  { id: "Telegram", icon: "t", color: "bg-[#0088cc]" },
  { id: "WhatsApp", icon: "w", color: "bg-[#25D366]" },
  { id: "YouTube", icon: "y", color: "bg-[#FF0000]" },
  { id: "TikTok", icon: "tk", color: "bg-black" },
  { id: "Reddit", icon: "r", color: "bg-[#FF4500]" },
  { id: "Snapchat", icon: "s", color: "bg-[#FFFC00]" },
  { id: "Pinterest", icon: "p", color: "bg-[#BD081C]" },
];

export default function Composer() {
  const [content, setContent] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>(["Telegram"]);
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ఇది ఉదాహరణకు మాత్రమే - భవిష్యత్తులో ఇది DB నుండి రావాలి
  const connectedAccounts = [
    { id: "tg_1", name: "Official Channel", platform: "Telegram", active: true },
    { id: "fb_1", name: "PostJet Business Page", platform: "Facebook", active: true },
    { id: "in_1", name: "@postjet_official", platform: "Instagram", active: false },
  ];

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
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);
    formData.append("selectedPlatforms", JSON.stringify(selectedApps));

    await postToAllPlatforms(formData);
    setLoading(false);
    alert("Post Dispatched! 🚀");
    setContent(""); setMedia(null); setPreview(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* 📟 Main Composer Panel */}
      <div className="flex-1 bg-white rounded-[3rem] p-10 shadow-2xl border border-blue-50 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
            <Zap className="text-blue-600 animate-pulse" size={24} />
            <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Broadcast Studio</h3>
        </div>

        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's the mission today? Write your content here..."
          className="w-full h-48 bg-slate-50 rounded-[2rem] p-8 text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 border-none resize-none transition-all"
        />

        {/* Media Preview Area */}
        <AnimatePresence>
          {preview && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mt-6 w-full h-40 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
               <img src={preview} className="w-full h-full object-cover" />
               <button onClick={() => {setMedia(null); setPreview(null);}} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl shadow-lg"><X size={16}/></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📱 Target App Selection (10+ Apps) */}
        <div className="mt-10">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Select Target Systems</p>
          <div className="flex flex-wrap gap-3">
            {ALL_PLATFORMS.map((app) => (
              <button
                key={app.id}
                onClick={() => toggleApp(app.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${
                  selectedApps.includes(app.id) ? 'scale-110 shadow-lg' : 'opacity-30 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div className={`${app.color} w-full h-full rounded-2xl flex items-center justify-center text-white font-black text-xs uppercase`}>
                  {app.icon}
                </div>
                {selectedApps.includes(app.id) && (
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border-2 border-white">
                    <Check size={10} strokeWidth={4} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 🔗 Connected Pages / Accounts List */}
        <div className="mt-10 pt-8 border-t border-slate-50">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Connected Destinations</p>
          <div className="space-y-3">
            {connectedAccounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-[10px] uppercase">{acc.platform[0]}</div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{acc.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{acc.platform}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${acc.active ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                  {acc.active ? 'Ready' : 'Link Required'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-10 flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer bg-slate-100 hover:bg-blue-100 px-6 py-4 rounded-2xl transition-all group">
            <ImageIcon className="text-slate-500 group-hover:text-blue-600" size={20} />
            <span className="text-xs font-black uppercase text-slate-500 group-hover:text-blue-600">Change Media</span>
            <input type="file" className="hidden" onChange={handleMediaChange} accept="image/*,video/*" />
          </label>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Transmitting..." : <><Send size={18} /> Post Now</>}
          </button>
        </div>
      </div>

      {/* 🛰️ Live Preview Panel */}
      <div className="w-full lg:w-[380px] sticky top-8">
          <div className="bg-slate-900 rounded-[3rem] p-2 shadow-2xl overflow-hidden">
             <div className="bg-white rounded-[2.5rem] overflow-hidden">
                <div className="p-6 flex items-center gap-3 border-b border-slate-50">
                   <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-blue-600">PJ</div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-tight">PostJet Official</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Global Sync Ready</p>
                   </div>
                </div>
                <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                   {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Globe className="text-slate-200" size={60} />}
                </div>
                <div className="p-8 h-40">
                   <p className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">{content || "Your transmission preview will appear here..."}</p>
                </div>
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <span className="text-[9px] font-black uppercase tracking-widest">Multi-Sync Preview</span>
                    <ShieldCheck size={16} />
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}