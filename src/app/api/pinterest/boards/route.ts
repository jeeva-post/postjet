import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.PINTEREST_CLIENT_ID?.trim();
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET?.trim();
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN?.trim();

  try {
    // పద్ధతి 2: Authorization Header వాడకుండా నేరుగా Body లో క్రెడెన్షియల్స్ పంపడం
    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken!,
        client_id: clientId!,
        client_secret: clientSecret!,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json({ 
        error: "Method 2 Failed", 
        pinterest_says: tokenData.message,
        hint: "Are these credentials from the SAME app where you got the refresh token?"
      });
    }

    // టోకెన్ వస్తే బోర్డ్స్ ని అడగడం
    const boardsRes = await fetch("https://api-sandbox.pinterest.com/v5/boards", {
      headers: { "Authorization": `Bearer ${tokenData.access_token}` },
    });

    const boardsData = await boardsRes.json();
    return NextResponse.json(boardsData);

  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}