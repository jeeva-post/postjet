import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const platform = params.platform;
  const cookieStore = await cookies();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Get current logged-in user
  const authHeader = cookieStore.get('sb-access-token')?.value;
  const { data: { user } } = await supabase.auth.getUser(authHeader);

  if (!user || !code) return NextResponse.json({ error: "Auth failed" });

  // 2. Exchange code for Access Token
  const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/${platform}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`);
  
  const tokenData = await tokenResponse.json();

  if (tokenData.access_token) {
    // 3. Save to user_connections table
    const { error } = await supabase
      .from('user_connections')
      .upsert({
        user_id: user.id,
        platform: platform,
        access_token: tokenData.access_token,
        metadata: { name: "Connected Account" }
      }, { onConflict: 'user_id,platform' });

    if (error) console.error("DB Error:", error);
  }

  // 4. Send user back to dashboard
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
}