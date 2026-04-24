import { NextResponse } from 'next/server';
import { linkAccount } from "../../../../actions/account-actions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const path = url.pathname; // ఏ ప్లాట్‌ఫామ్ నుండి వచ్చామో తెలుస్తుంది
  
  const platform = path.split('/').pop(); // facebook, linkedin, reddit etc.

  if (!code) return NextResponse.json({ error: 'No authorization code' });

  let tokenData: any = {};
  let accountName = "Business Profile";

  // --- PLATFORM LOGIC SWITCH ---
  if (platform === "facebook") {
    const res = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FB_APP_ID}&redirect_uri=${url.origin}/api/auth/callback/facebook&client_secret=${process.env.FB_APP_SECRET}&code=${code}`);
    tokenData = await res.json();
    
    // ఆటోమేటిక్ గా యూజర్ పేజీల లిస్ట్ తెచ్చుకోవడం
    const pages = await fetch(`https://graph.facebook.com/me/accounts?access_token=${tokenData.access_token}`).then(r => r.json());
    if (pages.data?.[0]) {
      tokenData.pageId = pages.data[0].id;
      tokenData.token = pages.data[0].access_token;
      accountName = pages.data[0].name;
    }
  }

  if (platform === "linkedin") {
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, client_id: process.env.LINKEDIN_CLIENT_ID!, client_secret: process.env.LINKEDIN_CLIENT_SECRET!, redirect_uri: `${url.origin}/api/auth/callback/linkedin` }),
    });
    tokenData = await res.json();
    tokenData.token = tokenData.access_token;
  }

  // --- SAVE TO DATABASE ---
  if (tokenData.token) {
    await linkAccount({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      accountName: accountName,
      config: tokenData
    });
  }

  return NextResponse.redirect(new URL('/dashboard/accounts', request.url));
}