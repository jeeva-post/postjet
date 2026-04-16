export async function postToYouTube(content: string, mediaUrl: string, accessToken: string) {
  try {
    const videoRes = await fetch(mediaUrl);
    const blob = await videoRes.blob();
    const metadata = { snippet: { title: content.substring(0, 100), description: content }, status: { privacyStatus: "public" } };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("video", blob);

    const res = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
      method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: formData
    });
    return await res.json();
  } catch (err: any) { return { success: false, error: err.message }; }
}