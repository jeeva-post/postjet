import { NextResponse } from 'next/server';
import { linkAccount } from "../../../../actions/account-actions";

export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code || !platform) {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=no_code', request.url));
  }

  let tokenData: any = {};
  let accountName = `${platform.toUpperCase()} Profile`;

  try {
    // --- 🔵 FACEBOOK & INSTAGRAM ---
    if (platform === "facebook" || platform === "instagram") {
      const res = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FB_APP_ID}&redirect_uri=${url.origin}/api/auth/callback/${platform}&client_secret=${process.env.FB_APP_SECRET}&code=${code}`);
      const data = await res.json();
      
      if (data.access_token) {
        const pages = await fetch(`https://graph.facebook.com/me/accounts?access_token=${data.access_token}`).then(r => r.json());
        if (pages.data?.[0]) {
          tokenData = { token: pages.data[0].access_token, pageId: pages.data[0].id };
          accountName = pages.data[0].name;
        }
      }
    }

    // --- 🔵 LINKEDIN ---
    if (platform === "linkedin") {
      const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
          redirect_uri: `${url.origin}/api/auth/callback/linkedin`,
        }),
      });
      const data = await res.json();
      tokenData = { token: data.access_token };
    }

    // --- 🟠 REDDIT ---
    if (platform === "reddit") {
      const auth = Buffer.from(`${process.env.REDDIT_ID}:${process.env.REDDIT_SECRET}`).toString('base64');
      const res = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: `${url.origin}/api/auth/callback/reddit` }),
      });
      const data = await res.json();
      tokenData = { token: data.access_token };
    }

    // --- 💾 SAVE TO DB ---
    if (tokenData.token) {
      const formattedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
      await linkAccount({
        platform: formattedPlatform,
        accountName: accountName,
        config: tokenData
      });
    }

    return NextResponse.redirect(new URL('/dashboard/accounts?success=true', request.url));
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.redirect(new URL('/dashboard/accounts?error=server_error', request.url));
  }
}