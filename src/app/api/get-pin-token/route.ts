import { NextResponse } from "next/server";

export async function GET() {
  // ఇక్కడ నీ వివరాలు మార్చు
  const clientId = 'నీ_CLIENT_ID'; 
  const clientSecret = 'నీ_CLIENT_SECRET'; 
  const code = '9559a7472f531dc0a211a5e8928153f38e6e9f07'; // బ్రౌజర్ నుండి కాపీ చేసినది
  const redirectUri = 'https://postjet.vercel.app/';

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await res.json();
    // ఇది మనకు కొత్త పర్మిషన్లతో కూడిన Refresh Token ఇస్తుంది
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}