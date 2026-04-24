import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const url = new URL(request.url);
  const callbackUrl = `${url.origin}/api/auth/callback/${platform}`;
  
  const fbId = process.env.FB_APP_ID;
  const lnId = process.env.LINKEDIN_CLIENT_ID;

  if (platform === "facebook" || platform === "instagram") {
    if (!fbId) return NextResponse.json({ error: "Vercel Settings లో FB_APP_ID లేదు!" });
    
    // pages_show_list ని మర్చిపోవద్దు, అప్పుడే పేజీలు కనిపిస్తాయి
    const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish`;
    return NextResponse.redirect(new URL(fbAuthUrl));
  }

  if (platform === "linkedin") {
    const lnAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${lnId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=w_member_social`;
    return NextResponse.redirect(new URL(lnAuthUrl));
  }

  if (platform === "telegram") {
    return NextResponse.redirect(new URL(`https://t.me/PostJetBot?start=auth_${Date.now()}`));
  }

  return NextResponse.redirect(new URL('/dashboard/accounts', request.url));
}