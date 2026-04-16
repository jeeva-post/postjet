"use client";
import { useState } from "react";

export default function GlobalDashboard() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  // 📁 ఇమేజ్/వీడియో అప్‌లోడ్ లాజిక్ (నీ స్వంత వివరాలతో)
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus("📤 Media అప్‌లోడ్ అవుతోంది... ఆగండి.");

    // నీ పర్సనల్ క్లౌడ్ వివరాలు ఇక్కడ ఉన్నాయి
    const CLOUD_NAME = "dd0kewyk5"; 
    const UPLOAD_PRESET = "postjet_preset"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      // Unsigned అప్‌లోడ్ పద్ధతి - దీనికి API Key అవసరం లేదు
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        setMediaUrl(data.secure_url); 
        setStatus("✅ Media Ready! ప్రివ్యూ చూడండి.");
      } else {
        // ఇక్కడ ఎర్రర్ వస్తే క్లియర్ గా చూపిస్తుంది
        setStatus(`❌ Error: ${data.error?.message || "Cloudinary గుర్తించలేకపోయింది"}`);
      }
    } catch (err) {
      setStatus("❌ నెట్‌వర్క్ ఇబ్బంది. మళ్ళీ ట్రై చెయ్యి.");
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
        setStatus(`✅ ${platform} లో సక్సెస్‌ఫుల్‌గా పోస్ట్ అయింది!`);
      } else {
        setStatus(`❌ ఎర్రర్: ${data.error || "ఏదో పొరపాటు జరిగింది"}`);
      }
    } catch (err) {
      setStatus("❌ కనెక్షన్ ఫెయిల్ అయింది.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ఎడమ వైపు: పోస్ట్ కంపోజర్ (SaaS Style) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
             <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">
               PostJet <span className="text-blue-600 not-italic">Pro</span>
             </h1>
             <span className="bg-blue-100 text-blue-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase">Enterprise Version</span>
          </div>
          
          <textarea
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl h-60 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg placeholder:text-slate-300 shadow-inner"
            placeholder="మీ గ్లోబల్ మెసేజ్ ఇక్కడ రాయండి..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="space-y-4">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 p-6 rounded-3xl hover:from-blue-100 hover:to-indigo-100 transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📁</span>
                <span className="font-bold text-blue-800">
                  {uploading ? "అప్‌లోడ్ అవుతోంది..." : "సిస్టమ్ గ్యాలరీ నుండి సెలెక్ట్ చెయ్యి"}
                </span>
              </div>
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {["whatsapp", "facebook", "instagram", "linkedin", "telegram", "youtube"].map((app) => (
                <button
                  key={app}
                  onClick={() => handlePost(app)}
                  disabled={loading || uploading}
                  className="bg-slate-900 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 shadow-md"
                >
                  Post to {app}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* కుడి వైపు: లైవ్ ప్రివ్యూ (ఇక్కడ ఇమేజ్ కనిపిస్తుంది) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Live Broadcast Preview</h3>
            
            <div className="bg-slate-100 rounded-[2rem] p-5 border border-slate-200 min-h-[450px] shadow-inner">
              {mediaUrl ? (
                <div className="w-full mb-5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  {mediaUrl.includes("video") ? (
                    <video src={mediaUrl} className="w-full h-auto" controls />
                  ) : (
                    <img src={mediaUrl} className="w-full h-auto" alt="Preview" />
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-200 rounded-2xl mb-5 flex items-center justify-center text-slate-400 italic text-sm">
                   మీడియా సెలెక్ట్ కాలేదు
                </div>
              )}
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                {content || "మీ మెసేజ్ యొక్క ప్రివ్యూ ఇక్కడ కనిపిస్తుంది..."}
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl font-black text-center text-xs uppercase tracking-widest shadow-lg transition-all border-2 ${status.includes("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-blue-700 border-blue-100"}`}>
            {status || "Ready to connect the world"}
          </div>
        </div>

      </div>
    </div>
  );
}