"use client";
import { useState } from "react";

export default function GlobalSaaSDashboard() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  // 📁 సిస్టమ్ గ్యాలరీ నుండి అప్‌లోడ్ చేయడం
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus("📤 Media అప్‌లోడ్ అవుతోంది...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postjet_preset"); // నీ Cloudinary Unsigned Preset పేరు

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "dvp8p7pqt"; 
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setMediaUrl(data.secure_url);
        setStatus("✅ Media సిద్ధంగా ఉంది!");
      } else {
        setStatus("❌ Cloudinary Error: " + (data.error?.message || "Upload failed"));
      }
    } catch (err) {
      setStatus("❌ అప్‌లోడ్ ఫెయిల్ అయింది.");
    } finally {
      setUploading(false);
    }
  };

  const handlePost = async (platform: string) => {
    if (!content && !mediaUrl) return alert("టెక్స్ట్ లేదా ఇమేజ్ ఏదో ఒకటి ఉండాలి!");
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
        setStatus(`✅ ${platform} లో పోస్ట్ అయింది!`);
      } else {
        const errorMsg = data.error || data.message || "Unknown Error";
        setStatus(`❌ ఎర్రర్: ${errorMsg}`);
      }
    } catch (err) {
      setStatus("❌ కనెక్షన్ ఎర్రర్.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ఎడమ వైపు: పోస్ట్ మేకర్ */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-black text-slate-800 mb-6">PostJet <span className="text-blue-600 italic">Composer</span></h1>
          
          <textarea
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl h-60 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg"
            placeholder="మీ గ్లోబల్ మెసేజ్ ఇక్కడ రాయండి..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-6 space-y-4">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-center gap-3 bg-blue-50 border-2 border-dashed border-blue-200 p-5 rounded-2xl hover:bg-blue-100 transition-all text-blue-700 font-bold">
                <span>📷 {uploading ? "Uploading..." : "Open System Media Library"}</span>
              </div>
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {["whatsapp", "telegram", "facebook", "instagram", "linkedin", "youtube"].map((app) => (
                <button
                  key={app}
                  onClick={() => handlePost(app)}
                  disabled={loading || uploading}
                  className="bg-slate-900 text-white p-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-md active:scale-95"
                >
                  Post to {app}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* కుడి వైపు: లైవ్ ప్రివ్యూ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Live Feed Preview</h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 min-h-[350px]">
              {mediaUrl ? (
                <div className="w-full mb-4 rounded-xl overflow-hidden shadow-sm bg-black">
                  {mediaUrl.includes("video") ? (
                    <video src={mediaUrl} className="w-full h-auto" controls />
                  ) : (
                    <img src={mediaUrl} className="w-full h-auto" alt="Preview" />
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-200 rounded-xl mb-4 flex items-center justify-center text-slate-400 italic text-sm">Media Preview Area</div>
              )}
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{content || "మీ మెసేజ్ ఇక్కడ కనిపిస్తుంది..."}</p>
            </div>
          </div>
          <div className={`p-4 rounded-2xl font-bold text-center text-sm shadow-sm border ${status.includes("✅") ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}>
            {status || "Ready to connect globally"}
          </div>
        </div>

      </div>
    </div>
  );
}