"use client";
import { useState } from "react";
import { Send, Image as ImageIcon, CheckCircle2, Zap, Paperclip, BarChart3, Users, Clock } from "lucide-react";
import { postToTelegram } from "@/app/actions/post-action";

export default function Composer() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ఇమేజ్ ప్రివ్యూ ని హ్యాండిల్ చేయడానికి
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // ఒరిజినల్ లోగోస్ అండ్ కలర్స్ (ఇక్కడ SVG లేదా ఇమేజ్ పాత్స్ ఇచ్చుకోవాలి)
  const platforms = [
    { name: "Telegram", color: "#0088cc", logo: "/logos/telegram.png" },
    { name: "Instagram", color: "#E1306C", logo: "/logos/instagram.png" },
    { name: "Facebook", color: "#1877F2", logo: "/logos/facebook.png" },
    { name: "X", color: "#000000", logo: "/logos/x.png" },
    { name: "LinkedIn", color: "#0077B5", logo: "/logos/linkedin.png" },
    { name: "YouTube", color: "#FF0000", logo: "/logos/youtube.png" },
    { name: "Pinterest", color: "#BD081C", logo: "/logos/pinterest.png" },
    { name: "TikTok", color: "#000000", logo: "/logos/tiktok.png" },
    { name: "Snapchat", color: "#FFFC00", logo: "/logos/snapchat.png" },
    { name: "WhatsApp", color: "#25D366", logo: "/logos/whatsapp.png" },
    { name: "Threads", color: "#000000", logo: "/logos/threads.png" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      {/* LEFT: The Editor & Platform Selection */}
      <div className="xl:col-span-8 space-y-10">
        <form action={postToTelegram} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-8">
            <Zap size={20} className="text-blue-600 fill-blue-600" />
            <h3 className="font-black text-[14px] uppercase tracking-[0.2em] text-slate-900">Broadcasting Studio</h3>
            <span className="ml-auto bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Live
            </span>
          </div>
          
          <textarea 
            name="content"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your story here, Jeevan..."
            className="w-full h-72 p-8 bg-slate-50 rounded-[2.5rem] border-none focus:ring-4 focus:ring-blue-50 text-slate-800 font-bold resize-none mb-10 text-xl placeholder:text-slate-300 transition-all shadow-inner"
          />

          {/* Social Platform Grid - Original Logos with Zoom Effect */}
          <div className="mb-12">
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-6 ml-2">Select Target Platforms</p>
              <div className="flex flex-wrap gap-6">
                  {platforms.map((p, index) => (
                      <div key={p.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                          <div 
                              className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-125 group-hover:shadow-2xl group-hover:-translate-y-2 ${index === 0 ? 'ring-4 ring-blue-500 ring-offset-4' : ''}`}
                              style={{ backgroundColor: `${p.color}10`}}
                          >
                              {/* ఒరిజినల్ లోగో ఇక్కడ పెట్టాలి - '/logos/telegram.png' లాగా */}
                              <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain" />
                          </div>
                          <span className="text-[9px] font-black uppercase text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{p.name}</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-100">
            <label className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase bg-slate-50 px-10 py-5 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-all w-full md:w-auto">
              <ImageIcon size={20} />
              <span>Attach Media</span>
              <input type="file" name="media" accept="image/*,video/*" className="hidden" onChange={handleImageChange} />
            </label>

            <button type="submit" className="bg-blue-600 text-white px-14 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-4 hover:bg-blue-700 shadow-3xl shadow-blue-500/30 active:scale-95 transition-all w-full md:w-auto">
              Post to All <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: Live Multisynchronous Preview (The Card) */}
      <div className="xl:col-span-4 sticky top-10 h-max">
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-8 ml-6">Live Broadcaster Preview</p>
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden max-w-[420px] mx-auto">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl italic">PJ</div>
                <div>
                    <p className="text-sm font-black text-slate-900">PostJet Official</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Ready to blast content</p>
                </div>
            </div>
            
            <div className="p-8 min-h-[350px]">
                {imagePreview ? (
                    <img src={imagePreview} className="w-full h-56 object-cover rounded-3xl mb-6 shadow-xl shadow-slate-200" alt="Preview" />
                ) : (
                    <div className="w-full h-56 bg-slate-50 rounded-3xl mb-6 flex items-center justify-center text-slate-200">
                        <ImageIcon size={64} />
                    </div>
                )}
                <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                    {text || "Your multi-platform message will appear here. Start typing in the studio..."}
                </p>
            </div>

            <div className="p-8 bg-slate-50/50 flex justify-between items-center text-slate-400 border-t border-slate-100">
                <div className="flex gap-5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300"></div>
                    <div className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300"></div>
                </div>
                <CheckCircle2 size={20} className="text-green-500" />
            </div>
        </div>
      </div>
    </div>
  );
}