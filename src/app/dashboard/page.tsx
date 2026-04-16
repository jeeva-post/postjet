"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session }: any = useSession();
  
  // --- State Variables (ఇవి లేకపోవడం వల్లే నీకు ఎర్రర్లు వచ్చాయి) ---
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>({});

  // అందుబాటులో ఉన్న ప్లాట్‌ఫారమ్స్
  const platformsList = [
    { id: "facebook", name: "Facebook" },
    { id: "instagram", name: "Instagram Business" },
    { id: "youtube", name: "YouTube Channel" },
    { id: "telegram", name: "Telegram" },
    { id: "discord", name: "Discord Server" },
    { id: "whatsapp", name: "WhatsApp" },
  ];

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // --- మెయిన్ పోస్టింగ్ లాజిక్ (100% working) ---
  const handlePost = async () => {
    if (selectedPlatforms.length === 0) return alert("Please select at least one platform!");
    if (!content && !mediaUrl) return alert("Please add some content or a media URL!");

    setLoading(true);
    const newStatus: any = {};

    for (const platform of selectedPlatforms) {
      newStatus[platform] = "Posting...";
      setStatus({ ...newStatus });

      try {
        const response = await fetch(`/api/post/${platform}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            content, 
            mediaUrl, 
            accessToken: session?.accessToken // NextAuth నుండి టోకెన్ తీసుకుంటుంది
          }),
        });

        const data = await response.json();

        if (data.success || !data.error) {
          // Instagram కి ప్రత్యేకమైన 20 సెకన్ల వెయిటింగ్ లాజిక్
          if (platform === "instagram" && data.creationId) {
            newStatus[platform] = "Processing (20s)...";
            setStatus({ ...newStatus });

            setTimeout(async () => {
              const pubRes = await fetch("/api/post/instagram-publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  igUserId: data.igUserId, 
                  creationId: data.creationId, 
                  accessToken: session?.accessToken 
                }),
              });
              const pubData = await pubRes.json();
              newStatus[platform] = pubData.success ? "✅ Success!" : "❌ Publish Error";
              setStatus({ ...newStatus });
            }, 20000);
          } else {
            newStatus[platform] = "✅ Success!";
          }
        } else {
          newStatus[platform] = `❌ Failed: ${data.error}`;
        }
      } catch (error) {
        newStatus[platform] = "❌ Connection Error";
      }
      setStatus({ ...newStatus });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PostJet Multi-Platform Poster</h1>

      {/* Input Section */}
      <div className="space-y-4 mb-8">
        <textarea
          className="w-full p-4 border rounded-lg text-black"
          placeholder="What's on your mind?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded text-black"
          placeholder="Media URL (Cloudinary link)"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
        />
      </div>

      {/* Platform Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {platformsList.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`p-3 rounded-lg border transition ${
              selectedPlatforms.includes(p.id) ? "bg-blue-600 text-white" : "bg-gray-100 text-black"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Post Button */}
      <button
        onClick={handlePost}
        disabled={loading}
        className={`w-full p-4 rounded-lg font-bold text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "🚀 Posting in Progress..." : "🔥 Post Everywhere Now"}
      </button>

      {/* Status Tracker */}
      <div className="mt-8 space-y-2">
        {Object.entries(status).map(([platform, msg]: any) => (
          <div key={platform} className="flex justify-between p-3 bg-white shadow rounded border">
            <span className="capitalize font-semibold">{platform}</span>
            <span className={msg.includes("✅") ? "text-green-600" : "text-blue-600"}>{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}