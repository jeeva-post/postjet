import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
  }

  const { platform } = await context.params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const cookieStore = await cookies();

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client could not be initialized' }, { status: 500 });
  }

  // 1. Get current logged-in user
  const authHeader = cookieStore.get('sb-access-token')?.value;
  const { data: { user } } = await supabase.auth.getUser(authHeader);

  if (!user || !code) return NextResponse.json({ error: "Auth failed" }, { status: 401 });

  let tokenData: any = {};
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/${platform}`;

  if (platform === 'facebook' || platform === 'instagram') {
    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUri}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`);
    tokenData = await tokenResponse.json();
  } else if (platform === 'linkedin') {
    const tokenResponse = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`);
    tokenData = await tokenResponse.json();
  } else {
    return NextResponse.json({ error: `Unsupported platform: ${platform}` }, { status: 400 });
  }

  if (tokenData.access_token) {
    const payload: any = {
      user_id: user.id,
      platform,
      access_token: tokenData.access_token,
      metadata: { name: "Connected Account" }
    };

    const { error } = await supabase
      .from('user_connections')
      .upsert(payload, { onConflict: 'user_id,platform' });

    if (error) console.error("DB Error:", error);
  }

  // 4. Send user back to dashboard
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
}