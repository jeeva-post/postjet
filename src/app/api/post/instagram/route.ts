import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, fileType } = await req.json();
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const igId = process.env.INSTAGRAM_BUSINESS_ID;

    // 1. ప్రాథమిక తనిఖీ (Basic Checks)
    if (!accessToken || !igId) {
      return NextResponse.json({ success: false, error: "Environment variables (Token/ID) missing!" });
    }

    if (!mediaUrl) {
      return NextResponse.json({ success: false, error: "ఇన్‌స్టాగ్రామ్ కి ఇమేజ్ లేదా వీడియో లింక్ కచ్చితంగా ఉండాలి." });
    }

    console.log("Instagram Posting Started...");

    // 2. మీడియా టైప్ నిర్ణయించడం (Image vs Video)
    const isVideo = fileType === "VIDEO" || mediaUrl.toLowerCase().endsWith(".mp4") || mediaUrl.toLowerCase().endsWith(".mov");
    
    // STEP 1: కంటైనర్ క్రియేట్ చేయడం
    let containerUrl = `https://graph.facebook.com/v19.0/${igId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    if (isVideo) {
      containerUrl += `&media_type=VIDEO&video_url=${encodeURIComponent(mediaUrl)}`;
    } else {
      containerUrl += `&image_url=${encodeURIComponent(mediaUrl)}`;
    }

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();

    if (!containerData.id) {
      return NextResponse.json({ 
        success: false, 
        error: "Media Container సృష్టించడం విఫలమైంది. లింక్ పబ్లిక్ గా ఉందో లేదో చూడండి.", 
        debug: containerData 
      });
    }

    const creationId = containerData.id;

    // STEP 2: వీడియో అయితే ప్రాసెసింగ్ కోసం ఆగడం (చాలా ముఖ్యం)
    if (isVideo) {
      console.log("Video processing... waiting 10 seconds.");
      await new Promise((resolve) => setTimeout(resolve, 10000)); 
    }

    // STEP 3: మీడియా పబ్లిష్ చేయడం
    const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
    const publishRes = await fetch(publishUrl, { method: "POST" });
    const publishData = await publishRes.json();

    if (publishData.id) {
      return NextResponse.json({ success: true, postId: publishData.id, message: "Instagram Post Success! 🚀" });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "పబ్లిష్ చేయడం విఫలమైంది. వీడియో ఇంకా ప్రాసెస్ అవుతూ ఉండొచ్చు.", 
        debug: publishData 
      });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}