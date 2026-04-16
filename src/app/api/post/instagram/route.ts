import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = process.env.FB_PAGE_ID;

    if (!accessToken || !pageId) {
      return NextResponse.json({ success: false, error: "Vercel లో FB_ACCESS_TOKEN లేదా FB_PAGE_ID మిస్ అయ్యాయి!" });
    }

    if (!mediaUrl) {
      return NextResponse.json({ success: false, error: "ఇన్స్టాగ్రామ్ పోస్ట్‌కి ఇమేజ్ లింక్ కచ్చితంగా ఉండాలి." });
    }

    // --- STEP 1: Facebook Page కి లింక్ అయిన Instagram Business Account ID ని కనుక్కోవడం ---
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );
    const igAccountData = await igAccountRes.json();

    if (!igAccountData.instagram_business_account) {
      return NextResponse.json({ 
        success: false, 
        error: "FB Page not found లేదా ఈ పేజీకి Instagram కనెక్ట్ అయి లేదు. సెట్టింగ్స్ చెక్ చెయ్యి." 
      });
    }

    const instagramBusinessId = igAccountData.instagram_business_account.id;

    // --- STEP 2: మీడియా కంటైనర్ క్రియేట్ చేయడం (Image Upload) ---
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content || "")}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const containerData = await containerRes.json();

    if (!containerData.id) {
      return NextResponse.json({ success: false, error: `Media Container Error: ${containerData.error?.message}` });
    }

    const creationId = containerData.id;

    // --- STEP 3: మీడియాను పబ్లిష్ చేయడం ---
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    if (publishData.id) {
      return NextResponse.json({ success: true, id: publishData.id });
    } else {
      return NextResponse.json({ success: false, error: `Publish Error: ${publishData.error?.message}` });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error: " + err.message });
  }
}