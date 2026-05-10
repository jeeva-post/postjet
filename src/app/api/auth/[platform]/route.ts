import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform;
  const cookieStore = await cookies();
  
  // Platform batti Redirect URL select cheyali
  let authUrl = "";
  const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`];
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/${platform}`;

  if (platform === 'facebook') {
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,pages_manage_posts,public_profile`;
  } 
  // Future lo ikkada LinkedIn, Pinterest add cheyocha
  
  return NextResponse.redirect(authUrl);
}