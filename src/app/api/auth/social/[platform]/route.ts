import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const { origin } = new URL(request.url);
  const callbackUrl = `${origin}/api/auth/callback/${platform}`;

  let authUrl = "";

  switch (platform) {
    case "facebook":
    case "instagram":
      const fbId = process.env.FACEBOOK_CLIENT_ID; // నీ వేరియబుల్ నేమ్
      authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish`;
      break;

    case "linkedin":
      const lnId = process.env.LINKEDIN_CLIENT_ID; // నీ వేరియబుల్ నేమ్
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${lnId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=w_member_social`;
      break;

    case "telegram":
      // టెలిగ్రామ్ బాట్ స్టార్ట్ లింక్
      authUrl = `https://t.me/${process.env.TELEGRAM_BOT_TOKEN?.split(':')[0]}?start=auth`;
      break;

    default:
      return NextResponse.redirect(new URL('/dashboard/accounts', request.url));
  }

  return NextResponse.redirect(authUrl);
}