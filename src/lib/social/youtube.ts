export async function postToYouTube(content: string, mediaUrl: string, accessToken: string) {
  try {
    console.log("🚀 YouTube Engine: Starting upload...");
    console.log("🎥 Media URL:", mediaUrl);

    if (!mediaUrl) throw new Error("YouTube needs a video URL.");

    // 1. Fetching video from Cloudinary
    console.log("⏳ YouTube Engine: Fetching video from Cloudinary...");
    const videoResponse = await fetch(mediaUrl);
    if (!videoResponse.ok) throw new Error("Failed to fetch video from Cloudinary");
    const videoBlob = await videoResponse.blob();
    console.log("✅ YouTube Engine: Video fetched, size:", videoBlob.size);

    // 2. Preparing Metadata
    const metadata = {
      snippet: {
        title: content.substring(0, 100) || "Video from PostJet",
        description: content,
        categoryId: "22",
      },
      status: { privacyStatus: "public" },
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("video", videoBlob);

    // 3. Uploading to YouTube
    console.log("📤 YouTube Engine: Uploading to Google Servers...");
    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      }
    );

    const data = await res.json();
    
    if (data.error) {
      console.error("❌ YouTube API Error Detail:", JSON.stringify(data.error));
      throw new Error(data.error.message || "YouTube API Upload Failed");
    }

    console.log("🎉 YouTube Engine: Successfully uploaded! ID:", data.id);
    return { success: true, platform: "youtube", id: data.id };
  } catch (err: any) {
    console.error("❌ YouTube Engine Error:", err.message);
    return { success: false, error: err.message, platform: "youtube" };
  }
}