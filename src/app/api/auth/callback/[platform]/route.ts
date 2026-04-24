import { NextRequest, NextResponse } from 'next/server';
import { linkAccount } from "../../../../actions/account-actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) return NextResponse.redirect(new URL('/dashboard/accounts?error=no_code', request.url));

  try {
    let tokenData: any = {};
    let accountName = `${platform.toUpperCase()} User`;

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
      if (data.access_token) tokenData = { token: data.access_token };
    }

    if (["facebook", "instagram", "whatsapp"].includes(platform)) {
      const res = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${url.origin}/api/auth/callback/${platform}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`);
      const data = await res.json();
      tokenData = { token: data.access_token };
    }

    if (tokenData.token) {
      await linkAccount({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        accountName,
        config: tokenData
      });
      return NextResponse.redirect(new URL('/dashboard/accounts?success=true', request.url));
    }

    return NextResponse.redirect(new URL('/dashboard/accounts?error=failed', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=error', request.url));
  }
}