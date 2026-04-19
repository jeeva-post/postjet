import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // Environment Variables తీసుకోవడం
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const igId = process.env.INSTAGRAM_BUSINESS_ID;

    // 1. సెక్యూరిటీ చెక్ - కీస్ ఉన్నాయో లేదో చూడటం
    if (!accessToken || !igId) {
      console.error("Missing Keys in Environment Variables!");
      return NextResponse.json({ 
        success: false, 
        error: "Server configuration error. API keys are missing." 
      });
    }

    console.log("Starting Instagram Post for ID:", igId);

    // 2. మీడియా కంటైనర్ క్రియేట్ చేయడం (Step 1)
    const containerUrl = `https://graph.facebook.com/v19.0/${igId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();

    if (!containerData.id) {
      console.error("Container Creation Failed:", containerData);
      return NextResponse.json({ 
        success: false, 
        error: containerData.error?.message || "Media container creation failed",
        debug: containerData 
      });
    }

    const creationId = containerData.id;
    console.log("Media Container Created. ID:", creationId);

    // 3. మీడియా పబ్లిష్ చేయడం (Step 2)
    const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
    
    const publishRes = await fetch(publishUrl, { method: "POST" });
    const publishData = await publishRes.json();

    if (publishData.id) {
      console.log("Post Published Successfully! ID:", publishData.id);
      return NextResponse.json({ 
        success: true, 
        postId: publishData.id,
        message: "Instagram Post Success! 🚀"
      });
    } else {
      console.error("Publishing Failed:", publishData);
      return NextResponse.json({ 
        success: false, 
        error: publishData.error?.message || "Publishing failed",
        debug: publishData 
      });
    }

  } catch (err: any) {
    console.error("Unexpected Instagram Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}