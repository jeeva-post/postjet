import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();

    const clientId = process.env.PINTEREST_CLIENT_ID?.trim();
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET?.trim();
    const refreshToken = process.env.PINTEREST_REFRESH_TOKEN?.trim();
    const boardId = process.env.PINTEREST_BOARD_ID?.trim();

    // 1. Refresh Token ఉపయోగించి Access Token తెచ్చుకోవడం
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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
        error: "Token Refresh Failed", 
        details: tokenData 
      });
    }

    const accessToken = tokenData.access_token;

    // --- డీబగ్గింగ్ కోసం నీవు అడిగిన లైన్ ---
    console.log("Payload:", { board_id: boardId, mediaUrl });

    // 2. పింటరెస్ట్ కి పోస్ట్ చేయడం (Sandbox URL)
    const postRes = await fetch("https://api-sandbox.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
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
      // ఇక్కడ వచ్చే ఎర్రర్ నీకు స్క్రీన్ మీద క్లియర్ గా కనిపిస్తుంది
      return NextResponse.json({ 
        success: false, 
        error: "Pin Creation Failed", 
        message: result.message || "Unknown Pinterest Error",
        details: result 
      });
    }

  } catch (err: any) {
    console.error("Pinterest API Route Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}