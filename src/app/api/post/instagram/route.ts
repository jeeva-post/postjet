import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, fileType } = await req.json();
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const igId = process.env.INSTAGRAM_BUSINESS_ID;

    // 1. ప్రాథమిక తనిఖీ (Config Check)
    if (!accessToken || !igId) {
      return NextResponse.json({ success: false, error: "Environment variables missing!" });
    }

    if (!mediaUrl) {
      return NextResponse.json({ success: false, error: "Media URL దొరకలేదు. ఫోటో లేదా వీడియో లింక్ ఉండాలి." });
    }

    // --- SaaS Logic: Cloudinary URL ని Instagram కి నచ్చేలా మార్చడం ---
    let finalMediaUrl = mediaUrl;
    if (mediaUrl.includes("cloudinary.com")) {
      // ఏ ఫార్మాట్ ఉన్నా .mp4 కి మార్చుతుంది
      finalMediaUrl = mediaUrl.replace(/\.[^/.]+$/, "") + ".mp4";
    }

    const isVideo = fileType === "VIDEO" || finalMediaUrl.toLowerCase().endsWith(".mp4");

    console.log("--- Instagram Post Attempt Starting ---");
    console.log("Target ID:", igId);
    console.log("Media URL:", finalMediaUrl);

    // STEP 1: కంటైనర్ క్రియేట్ చేయడం
    let containerUrl = `https://graph.facebook.com/v19.0/${igId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    if (isVideo) {
      containerUrl += `&media_type=VIDEO&video_url=${encodeURIComponent(finalMediaUrl)}`;
    } else {
      containerUrl += `&image_url=${encodeURIComponent(finalMediaUrl)}`;
    }

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();

    // --- DEBUGGING BLOCK: ఇక్కడ అసలు ప్రాబ్లం ఏంటో తెలుస్తుంది ---
    if (!containerData.id) {
      console.error("❌ META CONTAINER ERROR:", JSON.stringify(containerData, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: "Container Creation Failed",
        message: containerData.error?.message || "Unknown error from Meta",
        error_code: containerData.error?.code,
        error_subcode: containerData.error?.error_subcode, // ఇది చాలా ముఖ్యం
        debug: containerData // పూర్తి రిజల్ట్ ని UI కి పంపిస్తున్నాం
      });
    }

    const creationId = containerData.id;
    console.log("✅ Container Created! ID:", creationId);

    // STEP 2: వీడియో అయితే ప్రాసెసింగ్ కోసం ఆగడం (Polling)
    if (isVideo) {
      let status = "IN_PROGRESS";
      let attempts = 0;
      console.log("Video detected, waiting for processing...");

      while (status !== "FINISHED" && attempts < 15) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const statusData = await statusRes.json();
        status = statusData.status_code;
        
        console.log(`Attempt ${attempts + 1}: Status is ${status}`);

        if (status === "ERROR") {
          return NextResponse.json({ 
            success: false, 
            error: "Instagram వీడియోని ప్రాసెస్ చేయలేకపోయింది. బహుశా ఫార్మాట్ లేదా సైజ్ ప్రాబ్లం ఉండొచ్చు.",
            debug: statusData 
          });
        }
        attempts++;
      }
    }

    // STEP 3: ఫైనల్ పబ్లిష్
    const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
    const publishRes = await fetch(publishUrl, { method: "POST" });
    const publishData = await publishRes.json();

    if (publishData.id) {
      console.log("🚀 POST SUCCESSFUL! ID:", publishData.id);
      return NextResponse.json({ success: true, message: "Instagram Post Success! 🚀", postId: publishData.id });
    } else {
      console.error("❌ PUBLISH ERROR:", JSON.stringify(publishData, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: "Publish Failed", 
        message: publishData.error?.message, 
        debug: publishData 
      });
    }

  } catch (err: any) {
    console.error("🔥 CRITICAL API ERROR:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}