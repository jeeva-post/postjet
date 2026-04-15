export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    
    if (!igId) throw new Error("Vercel Settings లో INSTAGRAM_BUSINESS_ID మిస్ అయ్యింది.");
    if (!mediaUrl) throw new Error("Instagram కి కచ్చితంగా ఒక ఫోటో లేదా వీడియో ఉండాలి.");

    // Step 1: Media Container ని క్రియేట్ చేయడం (Image లేదా Video)
    const containerParams = new URLSearchParams({
      access_token: accessToken,
      caption: content,
      media_type: isVideo ? "VIDEO" : "IMAGE",
      [isVideo ? "video_url" : "image_url"]: mediaUrl
    });

    const cRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media?${containerParams.toString()}`, { 
      method: "POST" 
    });
    const cData = await cRes.json();

    if (cData.error) {
      throw new Error(`IG Container Error: ${cData.error.message}`);
    }

    // Step 2: క్రియేట్ అయిన కంటైనర్ ని పబ్లిష్ చేయడం
    const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish`;
    const pRes = await fetch(`${publishUrl}?creation_id=${cData.id}&access_token=${accessToken}`, { 
      method: "POST" 
    });
    const pData = await pRes.json();

    if (pData.error) {
      throw new Error(`IG Publish Error: ${pData.error.message}`);
    }

    return { success: true, id: pData.id, platform: "instagram" };

  } catch (err: any) {
    console.error("Instagram Engine Error:", err.message);
    return { success: false, error: err.message || "Unknown Instagram Error", platform: "instagram" };
  }
}