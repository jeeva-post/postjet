"use client";
import { useState } from "react";
import MediaGallery from "@/components/MediaGallery";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showGallery, setShowGallery] = useState(false); // గ్యాలరీని దాచడానికి/చూపించడానికి

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">PostJet Multi-Poster</h1>
      
      {/* టెక్స్ట్ ఏరియా */}
      <textarea
        className="w-full p-4 border-2 border-gray-100 rounded-xl h-40 outline-none focus:border-blue-500 transition-all resize-none shadow-sm text-gray-700"
        placeholder="మీ మెసేజ్ ఇక్కడ టైప్ చేయండి..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col space-y-3 mt-4">
        {/* గ్యాలరీని ఓపెన్/క్లోజ్ చేసే బటన్ */}
        <button 
          onClick={() => setShowGallery(!showGallery)}
          className="bg-blue-50 text-blue-600 p-3 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-200"
        >
          {showGallery ? "▲ Close Media Gallery" : "📷 Select Media (Image/Video)"}
        </button>

        {/* గ్యాలరీ కాంపోనెంట్ - కేవలం బటన్ నొక్కినప్పుడే కనిపిస్తుంది */}
        {showGallery && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <MediaGallery 
              onSelect={(url) => { setMediaUrl(url); setShowGallery(false); }} 
              selectedUrl={mediaUrl} 
            />
          </div>
        )}

        {/* సెలెక్ట్ అయిన మీడియా ప్రివ్యూ సూచన */}
        {mediaUrl && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
            <span className="text-green-700 text-xs font-medium truncate max-w-[80%]">
              ✔ Media Ready: {mediaUrl.split('/').pop()}
            </span>
            <button onClick={() => setMediaUrl("")} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
          </div>
        )}
      </div>

      {/* మల్టీ-ప్లాట్‌ఫామ్ బటన్స్ */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => handlePost("whatsapp")}
          className="bg-[#25D366] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-md transition-all active:scale-95"
        >
          WhatsApp
        </button>

        <button
          onClick={() => handlePost("telegram")}
          className="bg-[#0088cc] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-md transition-all active:scale-95"
        >
          Telegram
        </button>

        <button
          onClick={() => handlePost("instagram")}
          className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-md transition-all active:scale-95"
        >
          Instagram
        </button>

        <button
          onClick={() => handlePost("youtube")}
          className="bg-[#FF0000] text-white p-4 rounded-xl font-bold hover:opacity-90 shadow-md transition-all active:scale-95"
        >
          YouTube
        </button>
      </div>

      {/* స్టేటస్ మెసేజ్ */}
      {status && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold text-sm animate-bounce ${status.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}