import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const { origin } = new URL(request.url);
  const callbackUrl = `${origin}/api/auth/callback/${platform}`;
  
  const FB_ID = process.env.FACEBOOK_CLIENT_ID; 
  const LI_ID = process.env.LINKEDIN_CLIENT_ID; 

  let authUrl = "";

  switch (platform) {
    case "facebook":
    case "instagram":
    case "whatsapp":
      authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish,whatsapp_business_management,whatsapp_business_messaging`;
      break;

    case "linkedin":
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LI_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=w_member_social`;
      break;

    case "telegram":
      authUrl = `https://t.me/PostJetBot?start=auth_${Date.now()}`;
      break;

    default:
      return NextResponse.redirect(new URL('/dashboard/accounts', request.url));
  }

  return NextResponse.redirect(new URL(authUrl));
}