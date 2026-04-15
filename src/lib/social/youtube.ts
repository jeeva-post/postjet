export async function postToYouTube(content: string, mediaUrl: string, accessToken: string) {
  try {
    const res = await fetch(`https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        snippet: { title: content.substring(0, 100), description: content, categoryId: "22" },
        status: { privacyStatus: "public" }
      })
    });
    const data = await res.json();
    if (data.error) throw new Error("YouTube Error: " + data.error.message);
    return data;
  } catch (err: any) { 
    return { error: err.message || "Unknown YouTube Error" }; 
  }
}