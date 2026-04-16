import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // Vercel Environment Variables నుండి వివరాలు తీసుకోవడం
    const pageId = process.env.FACEBOOK_PAGE_ID; 
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      return NextResponse.json({ 
        success: false, 
        error: "Vercel సెట్టింగ్స్‌లో Facebook ID లేదా Token లేదు!" 
      });
    }

    let fbUrl = `https://graph.facebook.com/v20.0/${pageId}/`;
    let body: any = {};

    if (mediaUrl) {
      // ఫోటో అయితే 'photos', వీడియో అయితే 'videos'
      const isVideo = mediaUrl.toLowerCase().includes("video") || mediaUrl.toLowerCase().endsWith(".mp4");
      fbUrl += isVideo ? "videos" : "photos";
      
      body[isVideo ? "file_url" : "url"] = mediaUrl;
      body["caption"] = content || "";
    } else {
      // కేవలం టెక్స్ట్ అయితే 'feed'
      fbUrl += "feed";
      body["message"] = content;
    }

    body["access_token"] = accessToken;

    const res = await fetch(fbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) {
      // ఇక్కడ మెటా ఇచ్చే అసలు ఎర్రర్ మెసేజ్ కనిపిస్తుంది
      return NextResponse.json({ 
        success: false, 
        error: `FB Auth Error: ${data.error.message}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id || data.post_id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error: కనెక్షన్ ప్రాబ్లం" });
  }
}