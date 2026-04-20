import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();

    const clientId = process.env.PINTEREST_CLIENT_ID?.trim();
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET?.trim();
    const refreshToken = process.env.PINTEREST_REFRESH_TOKEN?.trim();

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // 1. Refresh Token Call
    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken!,
      }),
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: "Token Refresh Failed (Check ClientID/Secret/RefreshToken in Vercel)", 
        details: tokenData 
      });
    }

    const accessToken = tokenData.access_token;

    // 2. Pin Creation (Sandbox URL)
    const postRes = await fetch("https://api-sandbox.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: process.env.PINTEREST_BOARD_ID?.trim(),
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
        error: "Pin Creation Failed (Check Board ID or Sandbox access)", 
        details: result 
      });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}