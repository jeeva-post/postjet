import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    const refreshToken = process.env.PINTEREST_REFRESH_TOKEN;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // 1. Refresh Token ఉపయోగించి తాత్కాలిక Access Token పొందడం
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
    if (!tokenRes.ok) return NextResponse.json({ error: "Token error", details: tokenData });

    // 2. ఇప్పుడు శాండ్‌బాక్స్ లో ఉన్న బోర్డ్స్ లిస్ట్ అడగడం
    const boardsRes = await fetch("https://api-sandbox.pinterest.com/v5/boards", {
      headers: { "Authorization": `Bearer ${tokenData.access_token}` },
    });

    const boardsData = await boardsRes.json();
    return NextResponse.json(boardsData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}