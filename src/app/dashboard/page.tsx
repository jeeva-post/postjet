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
      if (data.success) setStatus(`✅ Posted to ${platform} Successfully!`);
      else setStatus(`❌ ${platform} Error: ${data.error}`);
    } catch (err) {
      setStatus(`❌ ${platform} Connection Error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-10 border-4 border-blue-500">
      <h1 className="text-3xl font-black text-blue-600 text-center mb-8 italic uppercase tracking-widest">
        PostJet V2 PRO
      </h1>
      
      <textarea
        className="w-full p-5 border-2 border-gray-200 rounded-2xl h-44 outline-none focus:border-blue-500 shadow-inner text-gray-700"
        placeholder="Write your amazing post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col space-y-4 mt-6">
        <button 
          onClick={() => setShowGallery(!showGallery)}
          className="bg-blue-600 text-white p-4 rounded-2xl text-md font-bold hover:bg-blue-700 shadow-lg"
        >
          {showGallery ? "▲ CLOSE GALLERY" : "📷 SELECT FROM GALLERY"}
        </button>

        {showGallery && (
          <div className="border-2 border-blue-100 rounded-2xl p-2 bg-gray-50">
            <MediaGallery 
              onSelect={(url) => { setMediaUrl(url); setShowGallery(false); }} 
              selectedUrl={mediaUrl} 
            />
          </div>
        )}

        {mediaUrl && (
          <div className="p-3 bg-green-100 rounded-xl border border-green-300 text-[10px] truncate text-green-800">
            ✅ Selected: {mediaUrl}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button onClick={() => handlePost("whatsapp")} className="bg-[#25D366] text-white p-4 rounded-xl font-bold shadow-md">WhatsApp</button>
        <button onClick={() => handlePost("telegram")} className="bg-[#0088cc] text-white p-4 rounded-xl font-bold shadow-md">Telegram</button>
        <button onClick={() => handlePost("instagram")} className="bg-[#E4405F] text-white p-4 rounded-xl font-bold shadow-md">Instagram</button>
        <button onClick={() => handlePost("youtube")} className="bg-[#FF0000] text-white p-4 rounded-xl font-bold shadow-md">YouTube</button>
      </div>

      {status && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold ${status.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}