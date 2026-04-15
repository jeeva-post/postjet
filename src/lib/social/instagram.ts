export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    if (!igId) throw new Error("Vercel Settings lo INSTAGRAM_BUSINESS_ID missing.");

    // Step 1: Create Container
    const body: any = {
      access_token: accessToken,
      caption: content,
      media_type: isVideo ? "VIDEO" : "IMAGE",
    };

    if (isVideo) {
      body.video_url = mediaUrl;
    } else {
      body.image_url = mediaUrl;
    }

    const cRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    
    const cData = await cRes.json();
    if (cData.error) throw new Error("IG Container Error: " + cData.error.message);
    const creationId = cData.id;

    // Step 2: Polling for Video
    if (isVideo) {
      let status = "IN_PROGRESS";
      for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 10000)); // 10 seconds wait
        const sRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const sData = await sRes.json();
        status = sData.status_code;
        if (status === "FINISHED") break;
        if (status === "ERROR") throw new Error("Instagram video processing failed.");
      }
      if (status !== "FINISHED") throw new Error("IG processing timed out.");
    } else {
      await new Promise(r => setTimeout(r, 5000));
    }

    // Step 3: Publish
    const pRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`, { 
      method: "POST" 
    });
    const pData = await pRes.json();
    if (pData.error) throw new Error("IG Publish Error: " + pData.error.message);

    return { success: true, id: pData.id, platform: "instagram" };
  } catch (err: any) { 
    return { success: false, error: err.message, platform: "instagram" }; 
  }
}