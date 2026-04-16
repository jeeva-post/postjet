"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  // 📁 సిస్టమ్ గ్యాలరీ నుండి ఫైల్ సెలెక్ట్ చేసినప్పుడు క్లౌడ్-డినరీకి అప్‌లోడ్ చేయడం
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus("📤 Media అప్‌లోడ్ అవుతోంది...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postjet_preset"); // నీ క్లౌడ్-డినరీ అన్‌సైన్డ్ ప్రిసెట్ పేరు ఇక్కడ ఇవ్వు

    try {
      // నేరుగా క్లౌడ్-డినరీకి అప్‌లోడ్ (నీ క్లౌడ్ పేరు మార్చుకో)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMediaUrl(data.secure_url);
      setStatus("✅ Media సిద్ధంగా ఉంది!");
    } catch (err) {
      setStatus("❌ అప్‌లోడ్ విఫలమైంది!");
    } finally {
      setUploading(false);
    }
  };

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
      setStatus(`❌ Connection Error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create PostJet Post</h1>
      
      {/* 📝 టెక్స్ట్ ఏరియా */}
      <textarea
        className="w-full p-4 border border-gray-200 rounded-lg h-40 outline-none focus:ring-2 focus:ring-green-400 transition-all text-gray-700"
        placeholder="Enter your message here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 📷 సిస్టమ్ గ్యాలరీ బటన్ */}
      <div className="mt-4 space-y-3">
        <label className="block w-full text-center bg-blue-50 text-blue-600 p-4 rounded-xl font-bold cursor-pointer hover:bg-blue-100 border-2 border-dashed border-blue-200">
          {uploading ? "⏳ Uploading..." : "📁 Open Media Library (System)"}
          <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </label>

        {mediaUrl && (
          <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden border">
            {mediaUrl.includes("video") ? (
              <video src={mediaUrl} className="w-full h-full object-cover" controls />
            ) : (
              <img src={mediaUrl} className="w-full h-full object-cover" alt="preview" />
            )}
            <button onClick={() => setMediaUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs">✕</button>
          </div>
        )}
      </div>

      {/* 🚀 అన్ని ప్లాట్‌ఫామ్ బటన్లు */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button onClick={() => handlePost("whatsapp")} className="bg-[#25D366] text-white p-3 rounded-xl font-bold hover:bg-green-600 transition-all">WhatsApp</button>
        <button onClick={() => handlePost("facebook")} className="bg-[#1877F2] text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all">FB Group</button>
        <button onClick={() => handlePost("instagram")} className="bg-[#E4405F] text-white p-3 rounded-xl font-bold hover:bg-pink-600 transition-all">Instagram</button>
        <button onClick={() => handlePost("linkedin")} className="bg-[#0A66C2] text-white p-3 rounded-xl font-bold hover:bg-blue-800 transition-all">LinkedIn</button>
        <button onClick={() => handlePost("youtube")} className="bg-[#FF0000] text-white p-3 rounded-xl font-bold hover:bg-red-700 transition-all">YouTube</button>
        <button onClick={() => handlePost("telegram")} className="bg-[#0088cc] text-white p-3 rounded-xl font-bold hover:bg-sky-600 transition-all">Telegram</button>
        <button onClick={() => handlePost("pinterest")} className="bg-[#BD081C] text-white p-3 rounded-xl font-bold hover:bg-red-800 transition-all">Pinterest</button>
        <button onClick={() => handlePost("reddit")} className="bg-[#FF4500] text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-all">Reddit</button>
        <button onClick={() => handlePost("discord")} className="bg-[#5865F2] text-white p-3 rounded-xl font-bold hover:bg-indigo-600 transition-all">Discord</button>
        <button onClick={() => handlePost("whatsapp-business")} className="bg-[#128C7E] text-white p-3 rounded-xl font-bold hover:bg-teal-700 transition-all">WA Business</button>
      </div>

      {status && (
        <div className={`mt-6 p-3 rounded-xl text-center font-bold text-sm ${status.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}