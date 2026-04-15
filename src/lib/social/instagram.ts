export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    
    // Step 1: Create Media Container
    const containerUrl = `https://graph.facebook.com/v19.0/${igId}/media`;
    const params = new URLSearchParams({
      access_token: accessToken,
      caption: content,
      media_type: isVideo ? "VIDEO" : "IMAGE",
      [isVideo ? "video_url" : "image_url"]: mediaUrl
    });

    const cRes = await fetch(`${containerUrl}?${params.toString()}`, { method: "POST" });
    const cData = await cRes.json();

    if (!cData.id) {
      console.error("Instagram Container Error:", cData.error);
      return { success: false, error: cData.error };
    }

    // Step 2: Publish the Container
    const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${cData.id}&access_token=${accessToken}`;
    const pRes = await fetch(publishUrl, { method: "POST" });
    const pData = await pRes.json();

    return { success: !!pData.id, data: pData };
  } catch (err) {
    return { success: false, error: err };
  }
}