"use client";
import { useState } from "react";
import MediaGallery from "@/components/MediaGallery";

export default function DashboardPage() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showGallery, setShowGallery] = useState(false);

  const handlePost = async (platform: string) => {
    if (!content && !mediaUrl) return alert("Please add content or select media!");
    setLoading(true);
    setStatus(`🚀 Posting to ${platform}...`);
    try {
      const res = await fetch(`/api/post/${platform}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrl }),
      });
      const data = await res.json();
      if (data.success) setStatus(`✅ Successfully posted to ${platform}!`);
      else setStatus(`❌ Error: ${data.error}`);
    } catch (err) {
      setStatus("❌ Connection failed!");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Creation Tools */}
        <div className="flex-1 p-8 space-y-6">
          <header className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">PostJet <span className="text-blue-600">Pro</span></h1>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">SaaS Dashboard</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">Z</div>
          </header>

          <textarea
            className="w-full p-6 bg-gray-50 border-none rounded-2xl h-48 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 placeholder-gray-400 transition-all resize-none"
            placeholder="Share something amazing with the world..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="space-y-3">
            <button 
              onClick={() => setShowGallery(!showGallery)}
              className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-dashed border-gray-200 p-4 rounded-2xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🖼️</span>
              <span className="font-semibold">{showGallery ? "Hide Library" : "Open Media Library"}</span>
            </button>

            {showGallery && (
              <div className="p-2 bg-gray-50 rounded-2xl animate-in fade-in zoom-in duration-300">
                <MediaGallery onSelect={(url) => { setMediaUrl(url); setShowGallery(false); }} selectedUrl={mediaUrl} />
              </div>
            )}

            {mediaUrl && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 rounded bg-white overflow-hidden shadow-sm">
                  <img src={mediaUrl} className="w-full h-full object-cover" alt="selected" />
                </div>
                <p className="text-[10px] text-blue-600 font-mono flex-1 truncate">{mediaUrl}</p>
                <button onClick={() => setMediaUrl("")} className="text-red-400 hover:text-red-600">✖</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Channels */}
        <div className="bg-gray-50 w-full md:w-72 p-8 border-l border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider">Target Channels</h2>
          <div className="space-y-4">
            {[
              { id: "whatsapp", label: "WhatsApp", color: "bg-green-500", shadow: "shadow-green-100" },
              { id: "telegram", label: "Telegram", color: "bg-sky-500", shadow: "shadow-sky-100" },
              { id: "instagram", label: "Instagram", color: "bg-pink-500", shadow: "shadow-pink-100" },
              { id: "youtube", label: "YouTube", color: "bg-red-500", shadow: "shadow-red-100" }
            ].map((app) => (
              <button
                key={app.id}
                onClick={() => handlePost(app.id)}
                className={`w-full ${app.color} ${app.shadow} text-white p-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm`}
              >
                Post to {app.label}
              </button>
            ))}
          </div>

          {status && (
            <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100 text-[11px] font-bold text-center shadow-sm">
              <span className={status.includes("✅") ? "text-green-500" : "text-red-500"}>{status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}