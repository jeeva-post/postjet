export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    if (!igId) throw new Error("Vercel Settings లో INSTAGRAM_BUSINESS_ID మిస్ అయ్యింది.");

    console.log(`IG: Starting upload for ${isVideo ? "VIDEO" : "IMAGE"}`);

    // Step 1: Media Container క్రియేట్ చేయడం
    const params = new URLSearchParams({
      access_token: accessToken,
      caption: content,
      media_type: isVideo ? "VIDEO" : "IMAGE",
      [isVideo ? "video_url" : "image_url"]: mediaUrl
    });

    const cRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media?${params.toString()}`, { method: "POST" });
    const cData = await cRes.json();

    if (cData.error) throw new Error("IG Container Error: " + cData.error.message);
    const creationId = cData.id;

    // 🔥 వీడియో అయితే అది రెడీ అయ్యే వరకు వెయిట్ చేయడం (Polling)
    if (isVideo) {
      console.log("IG: Video detected. Waiting for processing...");
      let status = "IN_PROGRESS";
      let attempts = 0;

      while (status !== "FINISHED" && attempts < 12) { // గరిష్టంగా 2 నిమిషాలు
        attempts++;
        console.log(`IG: Checking status... Attempt ${attempts}`);
        
        await new Promise(r => setTimeout(r, 10000)); // 10 సెకన్లు ఆగుతుంది
        
        const sRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const sData = await sRes.json();
        
        status = sData.status_code;
        if (status === "FINISHED") break;
        if (status === "ERROR") throw new Error("IG Video processing failed on their server.");
      }
      
      if (status !== "FINISHED") throw new Error("Instagram Video processing took too long.");
    }

    // Step 2: మీడియా ని పబ్లిష్ చేయడం
    console.log("IG: Media ready. Publishing now...");
    const pRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`, { method: "POST" });
    const pData = await pRes.json();

    if (pData.error) throw new Error("IG Publish Error: " + pData.error.message);

    return { success: true, id: pData.id, platform: "instagram" };

  } catch (err: any) {
    console.error("IG ENGINE ERROR:", err.message);
    return { success: false, error: err.message, platform: "instagram" };
  }
}