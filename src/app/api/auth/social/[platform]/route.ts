import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const { origin } = new URL(request.url);
  const callbackUrl = `${origin}/api/auth/callback/${platform}`;
  
  let authUrl = "";

  // నీ వెర్సెల్ వేరియబుల్ నేమ్స్ ఇవే కదా.. అవే వాడుతున్నాను
  const FB_ID = process.env.FACEBOOK_CLIENT_ID; 
  const LI_ID = process.env.LINKEDIN_CLIENT_ID;

  switch (platform) {
    case "facebook":
    case "instagram":
    case "whatsapp":
      // Meta ప్లాట్‌ఫామ్స్ అన్నింటికీ ఒకే ఐడి వాడుతున్నాం
      if (!FB_ID) return NextResponse.json({ error: "Vercel లో FACEBOOK_CLIENT_ID లేదు!" });
      authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish,whatsapp_business_management,whatsapp_business_messaging`;
      break;

    case "linkedin":
      if (!LI_ID) return NextResponse.json({ error: "Vercel లో LINKEDIN_CLIENT_ID లేదు!" });
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LI_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=w_member_social`;
      break;

    case "telegram":
      authUrl = `https://t.me/PostJetBot?start=auth_${Date.now()}`;
      break;

    case "threads":
      authUrl = `https://www.threads.net/oauth/authorize?client_id=${process.env.THREADS_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=threads_content_publish,threads_basic&response_type=code`;
      break;

    default:
      return NextResponse.redirect(new URL('/dashboard/accounts', request.url));
  }

  return NextResponse.redirect(new URL(authUrl));
}