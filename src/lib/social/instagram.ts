export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    if (!igId) throw new Error("Vercel లో INSTAGRAM_BUSINESS_ID సెట్ చేయలేదు.");

    // 1. Media Container క్రియేట్ చేయడం
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

    if (cData.error) throw new Error(`IG Container Error: ${cData.error.message}`);

    // 🔥 ముఖ్యమైనది: వీడియో అయితే ఇన్‌స్టాగ్రామ్ సర్వర్ ప్రాసెస్ చేయడానికి కొంచెం టైమ్ ఇస్తున్నాం
    if (isVideo) {
      console.log("Waiting 30 seconds for Instagram to process the video...");
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 సెకన్లు వెయిట్ చేస్తుంది
    }

    // 2. మీడియా ని పబ్లిష్ చేయడం
    const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish`;
    const pRes = await fetch(`${publishUrl}?creation_id=${cData.id}&access_token=${accessToken}`, { 
      method: "POST" 
    });
    const pData = await pRes.json();

    if (pData.error) throw new Error(`IG Publish Error: ${pData.error.message}`);

    return { success: true, id: pData.id, platform: "instagram" };

  } catch (err: any) {
    return { success: false, error: err.message, platform: "instagram" };
  }
}