import { NextResponse } from "next/server";

export async function GET() {
  const clientId = '1553520'; 
  const clientSecret = 'f3db7a7fd9caa0444b07152f805d47d75d71732c'; 
  const code = '9559a7472f531dc0a211a5e8928153f38e6e9f07'; // ఇది 10 నిమిషాల లోపే వాడాలి
  const redirectUri = 'https://postjet.vercel.app/';

  // మ్యాన్యువల్ గా హెడర్ తయారు చేయడం
  const auth = Buffer.from(`${clientId.trim()}:${clientSecret.trim()}`).toString('base64');

  try {
    const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code.trim(),
        redirect_uri: redirectUri,
      }),
    });

    const data = await res.json();
    console.log("Pinterest Response:", data);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}