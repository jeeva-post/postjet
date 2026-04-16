"use client";
import { useState } from "react";

export default function GlobalSaaSDashboard() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["whatsapp"]);

  const platforms = [
    { id: "whatsapp", name: "WhatsApp", icon: "📱", color: "hover:bg-green-500" },
    { id: "facebook", name: "Facebook", icon: "👥", color: "hover:bg-blue-600" },
    { id: "instagram", name: "Instagram", icon: "📸", color: "hover:bg-pink-500" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "hover:bg-blue-700" },
    { id: "telegram", name: "Telegram", icon: "✈️", color: "hover:bg-sky-500" },
    { id: "youtube", name: "YouTube", icon: "🎥", color: "hover:bg-red-600" },
    { id: "twitter", name: "X (Twitter)", icon: "🐦", color: "hover:bg-slate-900" },
  ];

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus("Processing Media...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postjet_preset"); 
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`, {
        method: "POST", body: formData,
      });
      const data = await res.json();
      setMediaUrl(data.secure_url);
      setStatus("Media optimized for Global delivery.");
    } catch (err) {
      setStatus("Upload failed. Try again.");
    } finally { setUploading(false); }
  };

  const handlePostAll = async () => {
    if (!content && !mediaUrl) return alert("Please add content to your post!");
    setLoading(true);
    setStatus("Broadcasting to all selected channels...");
    
    // అన్ని సెలెక్టెడ్ ప్లాట్‌ఫామ్స్ కి ఒకేసారి పోస్ట్ చేసే లాజిక్
    for (const platform of selectedPlatforms) {
      try {
        await fetch(`/api/post/${platform}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, mediaUrl }),
        });
      } catch (err) { console.error(`Failed for ${platform}`); }
    }
    
    setStatus("✅ Content successfully broadcasted globally!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Composer Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                PostJet <span className="text-blue-600">Composer</span>
              </h1>
              <div className="flex gap-2">
                 <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Professional Tier</span>
              </div>
            </div>

            {/* Platform Selector Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    selectedPlatforms.includes(p.id) 
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" 
                    : "border-slate-100 bg-slate-50 text-slate-500 opacity-60"
                  }`}
                >
                  <span>{p.icon}</span> {p.name}
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl h-56 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg placeholder:text-slate-300 resize-none"
              placeholder="What's the global message today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-6 flex items-center justify-between gap-4">
              <label className="flex-1 cursor-pointer group">
                <div className="flex items-center justify-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl group-hover:border-blue-400 transition-all">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-sm font-semibold text-slate-500 group-hover:text-blue-600">
                    {uploading ? "Uploading..." : "Click to Upload Media"}
                  </span>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>

              <button
                onClick={handlePostAll}
                disabled={loading || uploading}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
              >
                {loading ? "Broadcasting..." : "🚀 Publish Globally"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Live Feed Preview</h3>
            
            <div className="border border-slate-100 rounded-3xl p-4 min-h-[400px] flex flex-col shadow-inner bg-slate-50">
               {mediaUrl ? (
                 <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4">
                    {mediaUrl.includes("video") 
                      ? <video src={mediaUrl} className="w-full h-full object-cover" />
                      : <img src={mediaUrl} className="w-full h-full object-cover" alt="preview" />
                    }
                 </div>
               ) : (
                 <div className="w-full aspect-video bg-slate-200 rounded-2xl mb-4 flex items-center justify-center text-slate-400 italic text-sm">No media selected</div>
               )}
               <p className="text-slate-600 text-sm break-words leading-relaxed">
                 {content || "Your message will appear here..."}
               </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl font-bold text-center text-sm transition-all shadow-sm ${
            status.includes("✅") ? "bg-green-50 text-green-600 border border-green-100" : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}>
            {status || "Ready to connect with the world."}
          </div>
        </div>

      </div>
    </div>
  );
}