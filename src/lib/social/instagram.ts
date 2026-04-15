export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    if (!igId) throw new Error("Vercel Settings లో INSTAGRAM_BUSINESS_ID మిస్ అయ్యింది.");

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
    const creationId = cData.id;

    // 2. 🔥 POLLING LOGIC: ఇన్‌స్టాగ్రామ్ సర్వర్ ని చెక్ చేయడం
    let status = "IN_PROGRESS";
    let attempts = 0;
    const maxAttempts = 15; // గరిష్టంగా 150 సెకన్లు వెయిట్ చేస్తుంది (15 * 10s)

    while (status !== "FINISHED" && attempts < maxAttempts) {
      console.log(`Checking IG Media status... Attempt: ${attempts + 1}`);
      
      // ప్రతి చెక్ కి మధ్య 10 సెకన్ల విరామం
      await new Promise(r => setTimeout(r, 10000));
      
      const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
      const statusData = await statusRes.json();
      
      status = statusData.status_code;
      
      if (status === "ERROR") throw new Error("Instagram processing failed on their server.");
      if (status === "FINISHED") break;
      
      attempts++;
    }

    if (status !== "FINISHED") throw new Error("Instagram processing timed out. Video might be too large.");

    // 3. ఇప్పుడు పబ్లిష్ చేయడం (Media Ready అయ్యాక)
    const pRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`, { 
      method: "POST" 
    });
    const pData = await pRes.json();

    if (pData.error) throw new Error(`IG Publish Error: ${pData.error.message}`);

    return { success: true, id: pData.id, platform: "instagram" };

  } catch (err: any) {
    console.error("Instagram Repair Log:", err.message);
    return { success: false, error: err.message, platform: "instagram" };
  }
}