"use client";

import { useState } from "react";
import { postMediaToMeta } from "@/actions/facebook-actions";

export default function FacebookPageSelector({ pages }: { pages: any[] }) {
  const [selectedPages, setSelectedPages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const togglePage = (page: any) => {
    if (selectedPages.find((p) => p.id === page.id)) {
      setSelectedPages(selectedPages.filter((p) => p.id !== page.id));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const handlePost = async () => {
    if (selectedPages.length === 0) return alert("కనీసం ఒక పేజీని ఎంచుకోండి!");
    if (!file && !message) return alert("మెసేజ్ లేదా ఫైల్ ఏదైనా ఒకటి ఉండాలి!");

    setLoading(true);
    let mediaUrl = "";

    try {
      // 1. Cloudinary కి అప్‌లోడ్ (Gallery Upload)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_upload_preset"); // నీ Cloudinary Preset ఇక్కడ పెట్టు

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/upload`, {
          method: "POST",
          body: formData,
        });
        const cloudData = await cloudRes.json();
        mediaUrl = cloudData.secure_url;
      }

      // 2. Meta కి పంపడం
      const result = await postMediaToMeta(selectedPages, [], message, mediaUrl, file?.type || "text");
      alert(result.message);
      
      if (result.success) {
        setMessage("");
        setFile(null);
        setSelectedPages([]);
      }
    } catch (err) {
      alert("అప్‌లోడ్ చేయడంలో ఎర్రర్ వచ్చింది.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginTop: 0 }}>🚀 Meta Multi-Post (FB & IG)</h3>
      
      <textarea
        placeholder="మీ పోస్ట్ క్యాప్షన్ ఇక్కడ టైప్ చేయండి..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: "80px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px", outline: "none" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold" }}>మీడియా అప్‌లోడ్ (Gallery):</label>
        <input 
          type="file" 
          accept="image/*,video/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ fontSize: "14px" }}
        />
      </div>

      <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>పేజీలను ఎంచుకోండి:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
        {pages.map((page) => (
          <label key={page.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px", cursor: "pointer", border: selectedPages.find(p => p.id === page.id) ? "1px solid #1877F2" : "1px solid transparent" }}>
            <input type="checkbox" checked={!!selectedPages.find(p => p.id === page.id)} onChange={() => togglePage(page)} />
            <img src={page.picture?.data?.url} style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
            <div style={{ fontSize: "14px" }}>
              <strong>{page.name}</strong>
              {page.instagram_business_account && <span style={{ display: "block", fontSize: "11px", color: "#E1306C" }}>+ Linked Instagram ✅</span>}
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handlePost}
        disabled={loading}
        style={{ width: "100%", padding: "14px", backgroundColor: loading ? "#ccc" : "#1877F2", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
      >
        {loading ? "Processing..." : `Post to ${selectedPages.length} Destinations`}
      </button>
    </div>
  );
}