"use client";

import { useState } from "react";
import { postMediaToMeta } from "@/actions/facebook-actions";
import { sendTelegramMessage } from "@/actions/telegram-actions";
import { postToPinterest } from "@/actions/pinterest-actions";

export default function UniversalPostForm({ pages, isPinterestLinked }: { pages: any[], isPinterestLinked: boolean }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // సెలెక్షన్ స్టేట్స్
  const [isTelegramSelected, setIsTelegramSelected] = useState(true);
  const [isPinterestSelected, setIsPinterestSelected] = useState(false);
  const [selectedFB, setSelectedFB] = useState<any[]>([]);
  const [selectedIG, setSelectedIG] = useState<any[]>([]);

  const toggleFB = (page: any) => {
    if (selectedFB.find((p) => p.id === page.id)) {
      setSelectedFB(selectedFB.filter((p) => p.id !== page.id));
    } else {
      setSelectedFB([...selectedFB, page]);
    }
  };

  const toggleIG = (igAccount: any, pageToken: string) => {
    const igData = { id: igAccount.id, access_token: pageToken, name: igAccount.name || "Instagram" };
    if (selectedIG.find((p) => p.id === igAccount.id)) {
      setSelectedIG(selectedIG.filter((p) => p.id !== igAccount.id));
    } else {
      setSelectedIG([...selectedIG, igData]);
    }
  };

  const handleUniversalPost = async () => {
    if (!message && !file) return alert("దయచేసి మెసేజ్ రాయండి లేదా ఫైల్ సెలెక్ట్ చేయండి!");
    setLoading(true);

    try {
      let uploadedUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_preset"); 
        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/your_cloud/upload`, {
          method: "POST",
          body: formData,
        });
        const cloudData = await cloudRes.json();
        uploadedUrl = cloudData.secure_url;
      }

      const promises = [];
      if (isTelegramSelected) promises.push(sendTelegramMessage(message, uploadedUrl));
      if (selectedFB.length > 0 || selectedIG.length > 0) {
        promises.push(postMediaToMeta(selectedFB, selectedIG, message, uploadedUrl, file?.type || "text"));
      }
      if (isPinterestSelected && uploadedUrl && isPinterestLinked) {
        promises.push(postToPinterest(message, uploadedUrl));
      }

      await Promise.all(promises);
      alert("విజయవంతంగా పోస్ట్ చేయబడింది! 🎉");
      setMessage(""); setFile(null); setSelectedFB([]); setSelectedIG([]); setIsPinterestSelected(false);
    } catch (err) {
      alert("సమస్య వచ్చింది.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginTop: 0, fontSize: "20px", color: "#1c1c1c", marginBottom: "20px" }}>🚀 Universal Post Manager</h2>
      
      <textarea
        placeholder="మీ మెసేజ్ ఇక్కడ టైప్ చేయండి..."
        value={message} onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: "100px", padding: "15px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "20px", fontSize: "16px", outline: "none" }}
      />

      <div style={{ marginBottom: "25px", padding: "15px", border: "2px dashed #eee", borderRadius: "10px", backgroundColor: "#fafafa" }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
        <section>
          <p style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "14px" }}>Messengers & Pins:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#f0f9ff", borderRadius: "8px", cursor: "pointer", border: isTelegramSelected ? "2px solid #0088cc" : "1px solid #eee" }}>
              <input type="checkbox" checked={isTelegramSelected} onChange={() => setIsTelegramSelected(!isTelegramSelected)} />
              <span style={{ fontSize: "14px" }}>Telegram Channel ✅</span>
            </label>

            {/* Pinterest: ఎరుపు రంగు తీసేసి బ్లూ థీమ్ పెట్టాను */}
            <label style={{ 
              display: "flex", alignItems: "center", gap: "10px", padding: "12px", 
              backgroundColor: isPinterestLinked ? "#f0f7ff" : "#f5f5f5", 
              borderRadius: "8px", cursor: isPinterestLinked ? "pointer" : "not-allowed", 
              border: isPinterestSelected ? "2px solid #007bff" : "1px solid #eee",
              opacity: isPinterestLinked ? 1 : 0.6
            }}>
              <input type="checkbox" disabled={!isPinterestLinked} checked={isPinterestSelected} onChange={() => setIsPinterestSelected(!isPinterestSelected)} />
              <span style={{ fontSize: "14px", color: isPinterestLinked ? "#007bff" : "#888", fontWeight: "bold" }}>
                Pinterest Board 📌 {!isPinterestLinked && "(Not Linked)"}
              </span>
            </label>
          </div>
        </section>

        <section>
          <p style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "14px" }}>Social Media (FB & IG):</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto" }}>
            {pages.map((page) => (
              <div key={page.id} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px", cursor: "pointer", border: selectedFB.find(p => p.id === page.id) ? "1px solid #1877F2" : "1px solid #eee" }}>
                  <input type="checkbox" checked={!!selectedFB.find(p => p.id === page.id)} onChange={() => toggleFB(page)} />
                  <span style={{ fontSize: "13px" }}>{page.name} (FB)</span>
                </label>
                {page.instagram_business_account && (
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", backgroundColor: "#fff5f8", borderRadius: "8px", cursor: "pointer", marginLeft: "20px", border: selectedIG.find(p => p.id === page.instagram_business_account.id) ? "1px solid #E1306C" : "1px solid #eee" }}>
                    <input type="checkbox" checked={!!selectedIG.find(p => p.id === page.instagram_business_account.id)} onChange={() => toggleIG(page.instagram_business_account, page.access_token)} />
                    <span style={{ fontSize: "13px", color: "#E1306C", fontWeight: "bold" }}>{page.name} (Instagram) ✅</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <button onClick={handleUniversalPost} disabled={loading} style={{ width: "100%", padding: "16px", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
        {loading ? "Publishing..." : "Publish to Platforms"}
      </button>
    </div>
  );
}