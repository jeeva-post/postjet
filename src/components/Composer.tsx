"use client";
import { useState } from "react";
import { Send, Image as ImageIcon, CheckCircle2, Zap } from "lucide-react";
import { postToTelegram } from "@/app/actions/post-action";

export default function Composer() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: The Editor */}
      <div className="lg:col-span-7 space-y-8">
        <form action={postToTelegram} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100/50">
          <div className="flex items-center gap-2 mb-8">
            <Zap size={16} className="text-blue-600 fill-blue-600" />
            <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-400">Campaign Studio</h3>
          </div>
          
          <textarea 
            name="content"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your story..."
            className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] border-none focus:ring-4 focus:ring-blue-50 text-slate-700 font-bold resize-none mb-8 text-xl placeholder:text-slate-300 transition-all"
          />

          {/* Social Platform Grid - 11 Apps with Zoom Effect */}
          <div className="mb-10">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Select Target Platforms</p>
              <div className="flex flex-wrap gap-5">
                  <PlatformIcon color="#0088cc" name="Telegram" active />
                  <PlatformIcon color="#E1306C" name="Instagram" />
                  <PlatformIcon color="#1877F2" name="Facebook" />
                  <PlatformIcon color="#000000" name="X" />
                  <PlatformIcon color="#0077B5" name="LinkedIn" />
                  <PlatformIcon color="#FF0000" name="YouTube" />
                  <PlatformIcon color="#BD081C" name="Pinterest" />
                  <PlatformIcon color="#000000" name="TikTok" />
                  <PlatformIcon color="#FFFC00" name="Snapchat" />
                  <PlatformIcon color="#25D366" name="WhatsApp" />
                  <PlatformIcon color="#000000" name="Threads" />
              </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <label className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase bg-slate-50 px-8 py-4 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-all group">
              <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
              <span>Attach Media</span>
              <input type="file" name="media" accept="image/*,video/*" className="hidden" onChange={handleImageChange} />
            </label>

            <button type="submit" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:bg-blue-700 shadow-2xl shadow-blue-200 active:scale-95 transition-all w-full md:w-auto">
              Broadcast Now <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: Live Preview (Multinational Look) */}
      <div className="lg:col-span-5">
        <div className="sticky top-12">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 ml-6">Live Post Preview</p>
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden max-w-[400px] mx-auto">
                <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black">PJ</div>
                    <div>
                        <p className="text-xs font-black">PostJet Official</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Posting now...</p>
                    </div>
                </div>
                
                <div className="p-6 min-h-[300px]">
                    {imagePreview ? (
                        <img src={imagePreview} className="w-full h-48 object-cover rounded-2xl mb-4 shadow-lg" alt="Preview" />
                    ) : (
                        <div className="w-full h-48 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-200">
                            <ImageIcon size={48} />
                        </div>
                    )}
                    <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                        {text || "Your message will appear here as you type..."}
                    </p>
                </div>

                <div className="p-6 bg-slate-50/50 flex justify-between items-center text-slate-400">
                    <div className="flex gap-4"><div className="w-4 h-4 rounded-full bg-slate-200"></div><div className="w-4 h-4 rounded-full bg-slate-200"></div></div>
                    <CheckCircle2 size={18} className="text-blue-500" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function PlatformIcon({ color, name, active = false }: any) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <div 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-125 group-hover:shadow-xl group-hover:-translate-y-1 ${active ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}
            style={{ backgroundColor: `${color}10`, color: color }}
        >
            {/* Using text for now as placeholders, you can add SVG paths here */}
            <span className="font-black text-xs uppercase">{name[0]}</span>
        </div>
        <span className="text-[8px] font-black uppercase text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{name}</span>
    </div>
  );
}