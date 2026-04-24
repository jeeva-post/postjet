import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params; // Next.js 15 Fix
  const url = new URL(request.url);
  const callbackUrl = `${url.origin}/api/auth/callback/${platform}`;
  
  let authUrl = "";

  if (platform === "facebook" || platform === "instagram") {
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${callbackUrl}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish`;
  } else if (platform === "linkedin") {
    authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${callbackUrl}&scope=w_member_social`;
  } else if (platform === "reddit") {
    authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_ID}&response_type=code&state=pj&redirect_uri=${callbackUrl}&duration=permanent&scope=submit,identity`;
  } else if (platform === "telegram") {
    authUrl = `https://t.me/PostJetBot?start=auth_${Date.now()}`;
  }

  if (!authUrl) return NextResponse.redirect(new URL('/dashboard/accounts?error=invalid_platform', request.url));
  return NextResponse.redirect(authUrl);
}