import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { platform: string } }) {
  const platform = params.platform;
  // Live URL update cheyandi
  const baseUrl = "https://postjet.vercel.app/api/auth/callback";

  let authUrl = "";

  if (platform === "linkedin") {
    authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${baseUrl}/linkedin&scope=openid%20profile%20email%20w_member_social`;
  } 
  else if (platform === "facebook" || platform === "instagram") {
    // Pages fetch cheyali kabatti 'pages_show_list' kachitanga undali
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${baseUrl}/facebook&scope=pages_manage_posts,instagram_content_publish,pages_read_engagement,pages_show_list,public_profile`;
  }

  return NextResponse.redirect(authUrl);
}