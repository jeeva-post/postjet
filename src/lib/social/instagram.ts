export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    const params = new URLSearchParams({
      access_token: accessToken,
      caption: content,
      media_type: isVideo ? "VIDEO" : "IMAGE",
      [isVideo ? "video_url" : "image_url"]: mediaUrl
    });

    const cRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media?${params.toString()}`, { method: "POST" });
    const cData = await cRes.json();

    if (!cData.id) throw new Error("IG Container Error: " + (cData.error?.message || "Failed"));

    const pRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${cData.id}&access_token=${accessToken}`, { method: "POST" });
    const pData = await pRes.json();
    
    if (pData.error) throw new Error("IG Publish Error: " + pData.error.message);
    return { success: !!pData.id, data: pData };
  } catch (err: any) {
    return { error: err.message || "Unknown Instagram Error" };
  }
}