import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();

    // 1. Refresh Token ఉపయోగించి కొత్త Access Token తెచ్చుకోవడం
    // గమనిక: టోకెన్ రిఫ్రెష్ చేయడానికి ప్రొడక్షన్ URL నే వాడాలి
    const auth = Buffer.from(
      `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.PINTEREST_REFRESH_TOKEN!,
      }),
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: "Token Refresh Failed", 
        details: tokenData 
      });
    }

    const accessToken = tokenData.access_token;

    // 2. పింటరెస్ట్ కి పోస్ట్ చేయడం (Sandbox URL ఉపయోగిస్తున్నాం)
    // ఎందుకంటే నీ యాప్ ప్రస్తుతానికి 'Trial' మోడ్‌లో ఉంది
    const postRes = await fetch("https://api-sandbox.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: process.env.PINTEREST_BOARD_ID,
        media_source: {
          source_type: "image_url",
          url: mediaUrl,
        },
        description: content || "Posted via PostJet",
      }),
    });

    const result = await postRes.json();

    if (postRes.ok) {
      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.message || "Pinterest Sandbox Error", 
        details: result 
      });
    }

  } catch (err: any) {
    console.error("Pinterest API Route Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}