import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { platform, accessToken } = await request.json();

    if (platform === "facebook") {
      // Facebook Pages with Page Tokens fetch chestunnam
      const response = await fetch(
        `https://graph.facebook.com/me/accounts?access_token=${accessToken}`
      );
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      // Meta 'data' array lo name, id, access_token (page specific) untayi
      return NextResponse.json(data.data || []);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}