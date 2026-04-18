import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = process.env.FB_PAGE_ID;

    console.log("Using Page ID:", pageId);

    // 1. Instagram Business ID ని వెతకడం
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account,name&access_token=${accessToken}`
    );
    const igAccountData = await igAccountRes.json();

    // టెర్మినల్‌లో చెక్ చేయడం కోసం
    console.log("Facebook API Response:", igAccountData);

    if (!igAccountData.instagram_business_account) {
      return NextResponse.json({ 
        success: false, 
        error: `Instagram Business Account దొరకలేదు! మీరు ఇచ్చిన పేజీ పేరు: ${igAccountData.name || 'Unknown'}. దయచేసి ఈ పేజీకి ఇన్స్టాగ్రామ్ లింక్ అయిందో లేదో ఫేస్‌బుక్ సెట్టింగ్స్‌లో చూడండి.`,
        debug: igAccountData
      });
    }

    const igId = igAccountData.instagram_business_account.id;
    console.log("Found Instagram ID:", igId);

    // 2. మీడియా కంటైనర్ క్రియేట్ చేయడం
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content)}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const containerData = await containerRes.json();

    if (!containerData.id) {
      return NextResponse.json({ success: false, error: "Media container creation failed", debug: containerData });
    }

    // 3. పబ్లిష్ చేయడం
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    return publishData.id 
      ? NextResponse.json({ success: true, postId: publishData.id }) 
      : NextResponse.json({ success: false, error: "Publish failed", debug: publishData });

  } catch (err: any) {
    console.error("Instagram Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}