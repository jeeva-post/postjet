import { NextResponse } from "next/server";

export async function GET() {
  const clientId = '1553520';
  const clientSecret = 'f3db7a7fd9caa0444b07152f805d47d75d71732c';
  const code = 'bbfee7ef47e17c5c0661468a53eb513c43a470da'; // ఇది ఇంకా ఎక్స్‌పైర్ అవ్వలేదని ఆశిద్దాం
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
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}