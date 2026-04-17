import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = process.env.FB_PAGE_ID;

    // 1. Instagram Business ID ని కనుక్కోవడం
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );
    const igAccountData = await igAccountRes.json();

    if (!igAccountData.instagram_business_account) {
      return NextResponse.json({ success: false, error: "Instagram Business Account లింక్ అయి లేదు!" });
    }

    const igId = igAccountData.instagram_business_account.id;

    // 2. మీడియా కంటైనర్ క్రియేట్ చేయడం
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content)}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const containerData = await containerRes.json();

    // 3. పబ్లిష్ చేయడం
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    return publishData.id ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, error: "Publish failed" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}