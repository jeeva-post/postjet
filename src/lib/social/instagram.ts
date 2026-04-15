export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const igId = process.env.INSTAGRAM_BUSINESS_ID;
    if (!igId) throw new Error("Vercel Settings లో INSTAGRAM_BUSINESS_ID మిస్ అయ్యింది.");

    // 🔥 ఇక్కడ మనం మళ్ళీ ఒకసారి వీడియో అని పక్కాగా చెక్ చేస్తున్నాం
    const isActuallyVideo = mediaUrl.includes("/video/") || mediaUrl.match(/\.(mp4|mov|avi|webm|m4v|3gp|mkv)$/i) || isVideo;

    console.log(`IG Engine: Detected as ${isActuallyVideo ? "VIDEO" : "IMAGE"}`);

    // Step 1: Create Container
    const body: any = {
      access_token: accessToken,
      caption: content,
      media_type: isActuallyVideo ? "VIDEO" : "IMAGE",
    };

    if (isActuallyVideo) {
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

    // Step 2: Polling - వీడియో అయితేనే 10 సెకన్ల విరామంతో చెక్ చేస్తుంది
    if (isActuallyVideo) {
      console.log("IG: Video detected. Polling started...");
      let status = "IN_PROGRESS";
      for (let i = 0; i < 20; i++) { // 20 సార్లు అంటే గరిష్టంగా 200 సెకన్లు
        await new Promise(r => setTimeout(r, 10000)); // 10 సెకన్లు ఆగుతుంది
        
        const sRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const sData = await sRes.json();
        
        status = sData.status_code;
        console.log(`Polling Attempt ${i + 1}: Status is ${status}`);
        
        if (status === "FINISHED") break;
        if (status === "ERROR") throw new Error("Instagram server couldn't process this video.");
      }
      
      if (status !== "FINISHED") throw new Error("Instagram video processing timed out.");
    } else {
      // ఫోటో అయితే కేవలం 5 సెకన్లు వెయిట్ చేస్తుంది
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
    console.error("IG ENGINE ERROR:", err.message);
    return { success: false, error: err.message, platform: "instagram" }; 
  }
}