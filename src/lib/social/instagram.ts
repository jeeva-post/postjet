export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    if (!igId) throw new Error("Vercel Settings లో INSTAGRAM_BUSINESS_ID మిస్ అయ్యింది.");

    // క్లౌడినరీ లింక్ ని బట్టి అది వీడియోనా కాదా అని పక్కాగా చెక్ చేయడం
    const isRealVideo = mediaUrl.includes("/video/") || mediaUrl.match(/\.(mp4|mov|avi|webm)$/i);
    
    // Step 1: Container Creation
    // ఇక్కడ పారామీటర్స్ ని ఖచ్చితంగా ఇస్తున్నాం, అందుకే Invalid Parameter రాదు
    const containerParams: any = {
      access_token: accessToken,
      caption: content,
      media_type: isRealVideo ? "VIDEO" : "IMAGE",
    };

    if (isRealVideo) {
      containerParams.video_url = mediaUrl;
    } else {
      containerParams.image_url = mediaUrl;
    }

    const cRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(containerParams)
    });
    const cData = await cRes.json();
    if (cData.error) throw new Error("IG Container Error: " + cData.error.message);

    const creationId = cData.id;

    // Step 2: Polling for Video
    if (isRealVideo) {
      let status = "IN_PROGRESS";
      for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 10000));
        const sRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const sData = await sRes.json();
        status = sData.status_code;
        if (status === "FINISHED") break;
        if (status === "ERROR") throw new Error("IG processing failed on server.");
      }
    } else {
      await new Promise(r => setTimeout(r, 5000)); // ఫోటో కోసం 5 సెకన్లు చాలు
    }

    // Step 3: Publish
    const pRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`, { method: "POST" });
    const pData = await pRes.json();
    if (pData.error) throw new Error("IG Publish Error: " + pData.error.message);

    return { success: true, id: pData.id, platform: "instagram" };
  } catch (err: any) { 
    return { success: false, error: err.message, platform: "instagram" }; 
  }
}