import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.PINTEREST_CLIENT_ID?.trim();
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET?.trim();
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ error: "Vercel variables are missing!" });
  }

  // Header ని మళ్ళీ క్లీన్ గా తయారు చేయడం
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // ఇక్కడ ఖచ్చితమైన ఫార్మాట్ వాడుతున్నాం
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json({ 
        error: "Auth Failed again", 
        pinterest_message: tokenData.message,
        tip: "Check if your Client ID/Secret in Vercel has any extra quotes or spaces."
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