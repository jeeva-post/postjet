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
      // మనం క్రియేట్ చేసిన API రూట్స్ కి రిక్వెస్ట్ వెళ్తుంది
      const res = await fetch(`/api/post/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            content, 
            mediaUrl,
            fileType: mediaUrl.toLowerCase().endsWith(".mp4") ? "VIDEO" : "IMAGE" // ఆటోమేటిక్ గా ఫైల్ టైప్ గుర్తుపట్టడం
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Posted to ${platform} Successfully!`);
      } else {
        setStatus(`❌ ${platform} Error: ${data.error || data.message}`);
      }
    } catch (err) {
      setStatus(`❌ ${platform} Connection Error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-10 border border-gray-100 mb-20">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 text-center mb-8">
        PostJet Dashboard
      </h1>
      
      <textarea
        className="w-full p-5 border-2 border-gray-100 rounded-2xl h-44 outline-none focus:border-blue-400 transition-all resize-none shadow-inner text-gray-700 text-lg"
        placeholder="మీ పోస్ట్ వివరణ ఇక్కడ రాయండి..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col space-y-4 mt-6">
        <button 
          onClick={() => setShowGallery(!showGallery)}
          className="bg-blue-600 text-white p-4 rounded-2xl text-md font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          {showGallery ? "▲ Close Media Gallery" : "📷 Select Media from Cloudinary"}
        </button>

        {showGallery && (
          <div className="border-2 border-dashed border-blue-200 rounded-2xl p-3 bg-blue-50/50 animate-in fade-in zoom-in duration-300">
            <MediaGallery 
              onSelect={(url) => { setMediaUrl(url); setShowGallery(false); }} 
              selectedUrl={mediaUrl} 
            />
          </div>
        )}

        {mediaUrl && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border-2 border-green-200 animate-pulse">
            <span className="text-green-700 text-xs font-bold truncate max-w-[80%]">
              ✔ Media Ready! ({mediaUrl.split('/').pop()})
            </span>
            <button onClick={() => setMediaUrl("")} className="text-red-500 text-xs font-black hover:underline">REMOVE</button>
          </div>
        )}
      </div>

      {/* --- సోషల్ మీడియా బటన్ల గ్రిడ్ --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
        <button onClick={() => handlePost("whatsapp")} className="bg-[#25D366] text-white p-4 rounded-2xl font-bold hover:opacity-90 shadow-lg transition-all active:scale-95">WhatsApp</button>
        <button onClick={() => handlePost("telegram")} className="bg-[#0088cc] text-white p-4 rounded-2xl font-bold hover:opacity-90 shadow-lg transition-all active:scale-95">Telegram</button>
        <button onClick={() => handlePost("instagram")} className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">Instagram</button>
        <button onClick={() => handlePost("youtube")} className="bg-[#FF0000] text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">YouTube</button>
        
        {/* కొత్త ప్లాట్‌ఫారమ్స్ */}
        <button onClick={() => handlePost("threads")} className="bg-black text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">Threads</button>
        <button onClick={() => handlePost("slack")} className="bg-[#4A154B] text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">Slack</button>
        <button onClick={() => handlePost("discord")} className="bg-[#5865F2] text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">Discord</button>
        <button onClick={() => handlePost("pinterest")} className="bg-[#BD081C] text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">Pinterest</button>
      </div>

      {status && (
        <div className={`mt-8 p-5 rounded-2xl text-center font-black text-sm ${status.includes("✅") ? "bg-green-100 text-green-700 border-2 border-green-300" : "bg-red-100 text-red-700 border-2 border-red-300"}`}>
          {status}
          {loading && <span className="block text-xs font-normal mt-1 animate-bounce text-gray-500 italic">Processing media... please wait.</span>}
        </div>
      )}
    </div>
  );
}