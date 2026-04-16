export async function postToYouTube(content: string, mediaUrl: string, accessToken: string) {
  try {
    if (!mediaUrl) throw new Error("యూట్యూబ్ కి వీడియో ఫైల్ కచ్చితంగా ఉండాలి.");

    // 1. వీడియో డేటాను క్లౌడినరీ నుండి డౌన్‌లోడ్ చేయడం
    const videoResponse = await fetch(mediaUrl);
    const videoBlob = await videoResponse.blob();

    // 2. YouTube API కి కావలసిన Metadata (Title & Description)
    const metadata = {
      snippet: {
        title: content.substring(0, 100) || "New Video from PostJet",
        description: content,
        categoryId: "22", // People & Blogs
      },
      status: {
        privacyStatus: "public", // నేరుగా పబ్లిక్ లోకి వెళ్తుంది
      },
    };

    const formData = new FormData();
    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("video", videoBlob);

    // 3. అప్‌లోడ్ రిక్వెస్ట్
    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return { success: true, platform: "youtube", id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message, platform: "youtube" };
  }
}