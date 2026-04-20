import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.PINTEREST_CLIENT_ID?.trim();
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET?.trim();
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ error: "Missing Env Variables in Vercel!" });
  }

  // Basic Auth Header ని తయారు చేయడం
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // 1. Access Token కోసం రిక్వెస్ట్
    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json({ 
        error: "Token Refresh Failed", 
        pinterest_message: tokenData.message,
        details: "Check if Client ID and Secret are correct in Vercel"
      });
    }

    // 2. ఒకవేళ టోకెన్ వస్తే, శాండ్‌బాక్స్ బోర్డ్స్ అడగడం
    const boardsRes = await fetch("https://api-sandbox.pinterest.com/v5/boards", {
      headers: { "Authorization": `Bearer ${tokenData.access_token}` },
    });

    const boardsData = await boardsRes.json();
    return NextResponse.json(boardsData);

  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}