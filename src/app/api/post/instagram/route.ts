import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, fileType } = await req.json();
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const igId = process.env.INSTAGRAM_BUSINESS_ID;

    if (!accessToken || !igId) {
      return NextResponse.json({ success: false, error: "Environment variables missing!" });
    }

    if (!mediaUrl) {
      return NextResponse.json({ success: false, error: "Media URL దొరకలేదు." });
    }

    // SaaS Logic: Cloudinary URL conversion to .mp4
    let finalMediaUrl = mediaUrl;
    if (mediaUrl.includes("cloudinary.com")) {
      finalMediaUrl = mediaUrl.replace(/\.[^/.]+$/, "") + ".mp4";
    }

    const isVideo = fileType === "VIDEO" || finalMediaUrl.toLowerCase().endsWith(".mp4");

    console.log("--- Instagram Post Attempt (REELS MODE) ---");

    // STEP 1: కంటైనర్ క్రియేట్ చేయడం
    let containerUrl = `https://graph.facebook.com/v19.0/${igId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    if (isVideo) {
      // మార్పు ఇక్కడే: VIDEO బదులు REELS వాడుతున్నాం
      containerUrl += `&media_type=REELS&video_url=${encodeURIComponent(finalMediaUrl)}`;
    } else {
      containerUrl += `&image_url=${encodeURIComponent(finalMediaUrl)}`;
    }

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();

    if (!containerData.id) {
      console.error("❌ META CONTAINER ERROR:", JSON.stringify(containerData, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: "Container Creation Failed",
        message: containerData.error?.message,
        debug: containerData 
      });
    }

    const creationId = containerData.id;

    // STEP 2: వీడియో/రీల్ ప్రాసెసింగ్ కోసం పోలింగ్
    if (isVideo) {
      let status = "IN_PROGRESS";
      let attempts = 0;
      while (status !== "FINISHED" && attempts < 15) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const statusData = await statusRes.json();
        status = statusData.status_code;
        console.log(`Processing Status: ${status}`);
        if (status === "ERROR") return NextResponse.json({ success: false, error: "Instagram failed to process Reel." });
        attempts++;
      }
    }

    // STEP 3: ఫైనల్ పబ్లిష్
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    if (publishData.id) {
      return NextResponse.json({ success: true, message: "Instagram Reel Success! 🚀", postId: publishData.id });
    } else {
      return NextResponse.json({ success: false, error: "Publish Failed", debug: publishData });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}