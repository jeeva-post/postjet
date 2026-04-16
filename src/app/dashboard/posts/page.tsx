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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Posted to ${platform} Successfully!`);
      } else {
        setStatus(`❌ ${platform} Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`❌ ${platform} Connection Error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-2xl mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">PostJet Multi-Poster</h1>
      
      <textarea
        className="w-full p-4 border-2 border-gray-100 rounded-xl h-40 outline-none focus:border-blue-500 transition-all resize-none shadow-sm text-gray-700"
        placeholder="మీ మెసేజ్ ఇక్కడ రాయండి..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col space-y-3 mt-4">
        <button 
          onClick={() => setShowGallery(!showGallery)}
          className="bg-blue-600 text-white p-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md"
        >
          {showGallery ? "▲ Close Media Gallery" : "📷 Select Media (Image/Video)"}
        </button>

        {showGallery && (
          <div className="border rounded-xl p-2 bg-gray-50 animate-in fade-in zoom-in duration-200">
            <MediaGallery 
              onSelect={(url) => { setMediaUrl(url); setShowGallery(false); }} 
              selectedUrl={mediaUrl} 
            />
          </div>
        )}

        {mediaUrl && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
            <span className="text-green-700 text-[10px] font-medium truncate max-w-[80%]">
              ✔ Media Ready: {mediaUrl}
            </span>
            <button onClick={() => setMediaUrl("")} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button onClick={() => handlePost("whatsapp")} className="bg-[#25D366] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-lg active:scale-95 transition-all">WhatsApp</button>
        <button onClick={() => handlePost("telegram")} className="bg-[#0088cc] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-lg active:scale-95 transition-all">Telegram</button>
        <button onClick={() => handlePost("instagram")} className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-lg active:scale-95 transition-all">Instagram</button>
        <button onClick={() => handlePost("youtube")} className="bg-[#FF0000] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-lg active:scale-95 transition-all">YouTube</button>
      </div>

      {status && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold text-sm ${status.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}