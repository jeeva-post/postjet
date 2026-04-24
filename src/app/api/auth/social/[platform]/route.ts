import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const url = new URL(request.url);
  const callbackUrl = `${url.origin}/api/auth/callback/${platform}`;
  
  let authUrl = "";

  const fbId = process.env.FB_APP_ID;
  const lnId = process.env.LINKEDIN_CLIENT_ID;
  const rId = process.env.REDDIT_ID;

  switch (platform) {
    case "facebook":
    case "instagram":
      if (!fbId) return NextResponse.json({ error: "FB_APP_ID is missing in Vercel" });
      authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish`;
      break;
    case "linkedin":
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${lnId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=w_member_social`;
      break;
    case "reddit":
      authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${rId}&response_type=code&state=pj&redirect_uri=${encodeURIComponent(callbackUrl)}&duration=permanent&scope=submit,identity`;
      break;
    case "telegram":
      authUrl = `https://t.me/PostJetBot?start=auth_${Date.now()}`;
      break;
    default:
      return NextResponse.redirect(new URL('/dashboard/accounts?error=unsupported', request.url));
  }

  return NextResponse.redirect(authUrl);
}