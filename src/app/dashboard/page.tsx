"use client";
import { useState } from "react";

export default function GlobalDashboard() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  // 📁 1. సిస్టమ్ గ్యాలరీ నుండి అప్‌లోడ్ చేసి ప్రివ్యూ చూపించడం
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus("📤 Media అప్‌లోడ్ అవుతోంది... దయచేసి ఆగండి.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postjet_preset"); // ఇది నీ Cloudinary అన్‌సైన్డ్ ప్రిసెట్ పేరు

    try {
      // ఇక్కడ నీ Cloudinary Name ని నేరుగా ఇస్తున్నాను (దీన్ని నీ పేరుతో మార్చుకో)
      const cloudName = "dvp8p7pqt"; 
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        setMediaUrl(data.secure_url); // ఇక్కడ URL సెట్ అవ్వగానే Preview కనిపిస్తుంది
        setStatus("✅ Media సిద్ధంగా ఉంది! ఇప్పుడు పోస్ట్ చెయ్యి.");
      } else {
        setStatus("❌ Cloudinary Error: " + data.error?.message);
      }
    } catch (err) {
      setStatus("❌ అప్‌లోడ్ ఫెయిల్ అయింది. ఇంటర్నెట్ చూసుకో.");
    } finally {
      setUploading(false);
    }
  };

  // 🚀 2. వాట్సాప్ మరియు ఇతర యాప్స్ కి పోస్ట్ చేయడం
  const handlePost = async (platform: string) => {
    if (!content && !mediaUrl) return alert("దయచేసి టెక్స్ట్ లేదా ఇమేజ్ సెలెక్ట్ చెయ్యి!");
    
    setLoading(true);
    setStatus(`🚀 ${platform} కి పంపిస్తున్నాను...`);

    try {
      const res = await fetch(`/api/post/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrl }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(`✅ ${platform} లో సక్సెస్‌ఫుల్‌గా పోస్ట్ అయింది!`);
      } else {
        setStatus(`❌ ఎర్రర్: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ కనెక్షన్ ఎర్రర్. మళ్ళీ ట్రై చెయ్యి.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ఎడమ వైపు: పోస్ట్ క్రియేటర్ */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">PostJet <span className="text-blue-600">Composer</span></h1>
          
          <textarea
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl h-60 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg"
            placeholder="మీ పోస్ట్ ఇక్కడ రాయండి..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex flex-col gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-3 bg-blue-50 border-2 border-dashed border-blue-200 p-5 rounded-2xl hover:bg-blue-100 transition-all">
                <span className="text-2xl">📷</span>
                <span className="font-bold text-blue-700">
                  {uploading ? "Uploading Content..." : "Open System Gallery"}
                </span>
              </div>
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
            </label>

            {/* అన్ని ప్లాట్‌ఫామ్ బటన్లు */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["whatsapp", "facebook", "instagram", "linkedin", "telegram", "youtube"].map((app) => (
                <button
                  key={app}
                  onClick={() => handlePost(app)}
                  disabled={loading || uploading}
                  className="bg-slate-900 text-white p-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:bg-slate-300"
                >
                  Post to {app}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* కుడి వైపు: LIVE PREVIEW (ఇక్కడ నీకు ఇమేజ్ కనిపిస్తుంది) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Live Feed Preview</h3>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 min-h-[350px]">
              {mediaUrl ? (
                <div className="w-full mb-4 rounded-xl overflow-hidden shadow-md">
                  {mediaUrl.includes("video") ? (
                    <video src={mediaUrl} className="w-full h-auto" controls />
                  ) : (
                    <img src={mediaUrl} className="w-full h-auto" alt="Preview" />
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-200 rounded-xl mb-4 flex items-center justify-center text-slate-400 italic text-sm">
                  Media ఇంకా సెలెక్ట్ చేయలేదు
                </div>
              )}
              <p className="text-slate-700 whitespace-pre-wrap">{content || "నీ మెసేజ్ ఇక్కడ కనిపిస్తుంది..."}</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl font-bold text-center text-sm shadow-sm ${status.includes("✅") ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {status || "Ready to Post"}
          </div>
        </div>

      </div>
    </div>
  );
}