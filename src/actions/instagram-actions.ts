"use server";
import cloudinary from '@/lib/cloudinary';

export async function postToInstagram(formData: FormData) {
  const text = formData.get("text") as string || "";
  const file = formData.get("media") as File;
  const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

  if (!igId || !token) return { success: false, error: "Credentials missing in .env!" };
  if (!file || file.size === 0) return { success: false, error: "దయచేసి ఒక మీడియా ఫైల్ ఎంచుకో!" };

  const isVideo = file.type.startsWith("video");

  try {
    // 1. Cloudinary Upload (ఇక్కడ వీడియోని ఆటోమేటిక్ గా సెట్ చేస్తున్నాం)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadRes: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: "auto", 
          folder: "postjet",
          // వీడియో అయితే ఇన్‌స్టాగ్రామ్ కి నచ్చే mp4 మరియు క్వాలిటీ లోకి మారుస్తుంది
          transformation: isVideo ? [
            { width: 720, crop: "limit" }, // వెడల్పును కంట్రోల్ చేయడం
            { quality: "auto", fetch_format: "mp4" }
          ] : []
        },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(buffer);
    });

    const mediaUrl = uploadRes.secure_url;

    // 2. Step 1: కంటైనర్ క్రియేషన్
    // ఇక్కడ మనం చాలా క్లీన్ గా డేటా పంపాలి
    const body: any = {
      caption: text,
      access_token: token,
      media_type: isVideo ? 'REELS' : 'IMAGE', // VIDEO బదులు REELS వాడటం ఉత్తమం
    };

    if (isVideo) {
      body.video_url = mediaUrl;
    } else {
      body.image_url = mediaUrl;
    }

    const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const containerData = await containerRes.json();
    
    if (!containerRes.ok) {
      // 👈 నీ టెర్మినల్ లో ఈ ఎర్రర్ ఏంటో క్లియర్ గా కనిపిస్తుంది
      console.error("FULL META ERROR:", JSON.stringify(containerData, null, 2));
      return { success: false, error: containerData.error?.message || "Invalid Parameter" };
    }

    const creationId = containerData.id;

    // 3. Step 2: Polling (వీడియో రెడీ అయ్యే వరకు ఆగడం)
    let isReady = false;
    let attempts = 0;
    while (!isReady && attempts < 15) {
      await new Promise(r => setTimeout(r, 5000));
      const statusRes = await fetch(`https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${token}`);
      const statusData = await statusRes.json();
      
      if (statusData.status_code === 'FINISHED') isReady = true;
      if (statusData.status_code === 'ERROR') return { success: false, error: "Instagram media processing failed." };
      
      attempts++;
      console.log(`Checking IG Status... Attempt ${attempts}: ${statusData.status_code}`);
    }

    if (!isReady) return { success: false, error: "Processing timed out. Please try a smaller video." };

    // 4. Step 3: Final Publish
    const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId, access_token: token }),
    });

    const publishData = await publishRes.json();
    if (publishRes.ok) return { success: true };

    return { success: false, error: publishData.error?.message || "Publishing failed" };

  } catch (err: any) {
    return { success: false, error: err.message };
  }
}