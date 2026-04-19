import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();

    // 1. Refresh Token తో Access Token పొందడం
    const auth = Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString('base64');
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
    if (!tokenRes.ok) return NextResponse.json({ success: false, error: "Auth Failed: " + tokenData.message });

    const accessToken = tokenData.access_token;

    // 2. పింటరెస్ట్ కి పోస్ట్ చేయడం
    const postRes = await fetch("https://api.pinterest.com/v5/pins", {
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
      // ఇక్కడ పింటరెస్ట్ ఇచ్చే అసలైన ఎర్రర్ మెసేజ్ ని పంపిస్తున్నాం
      return NextResponse.json({ 
        success: false, 
        error: result.message || "Pinterest API Error", 
        details: result 
      });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}