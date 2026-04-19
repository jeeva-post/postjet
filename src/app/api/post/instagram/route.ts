import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, fileType } = await req.json();
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const igId = process.env.INSTAGRAM_BUSINESS_ID;

    if (!accessToken || !igId || !mediaUrl) {
      return NextResponse.json({ success: false, error: "Missing API Configuration (Token/ID)" });
    }

    // --- SaaS Feature: Automatic Format Conversion (Cloudinary) ---
    let finalMediaUrl = mediaUrl;
    if (mediaUrl.includes("cloudinary.com")) {
      // యూజర్ ఏ ఫార్మాట్ ఇచ్చినా (.avi, .mkv, .mov), దాన్ని .mp4 గా క్లౌడినరీ మారుస్తుంది
      finalMediaUrl = mediaUrl.replace(/\.[^/.]+$/, "") + ".mp4";
    }

    const isVideo = fileType === "VIDEO" || finalMediaUrl.toLowerCase().endsWith(".mp4");

    // STEP 1: Create Media Container
    let containerUrl = `https://graph.facebook.com/v19.0/${igId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    if (isVideo) {
      containerUrl += `&media_type=VIDEO&video_url=${encodeURIComponent(finalMediaUrl)}`;
    } else {
      containerUrl += `&image_url=${encodeURIComponent(finalMediaUrl)}`;
    }

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();

    if (!containerData.id) {
      return NextResponse.json({ success: false, error: "Container Creation Failed", debug: containerData });
    }

    const creationId = containerData.id;

    // STEP 2: Polling for Video Status (వీడియో ప్రాసెస్ అయ్యేదాకా ఆగడం)
    if (isVideo) {
      let status = "IN_PROGRESS";
      let attempts = 0;
      // గరిష్టంగా 15 సార్లు (75 సెకన్లు) చెక్ చేస్తుంది
      while (status !== "FINISHED" && attempts < 15) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 సెకన్ల విరామం
        const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const statusData = await statusRes.json();
        status = statusData.status_code;

        if (status === "ERROR") {
          return NextResponse.json({ success: false, error: "Instagram failed to process this video format." });
        }
        attempts++;
      }
      
      if (status !== "FINISHED") {
        return NextResponse.json({ success: false, error: "Video processing took too long. Please try a smaller file." });
      }
    }

    // STEP 3: Final Publish
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    if (publishData.id) {
      return NextResponse.json({ success: true, message: "Instagram Post Success! 🚀", postId: publishData.id });
    } else {
      return NextResponse.json({ success: false, error: "Publishing Failed", debug: publishData });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}