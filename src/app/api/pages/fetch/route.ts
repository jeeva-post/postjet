import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. Cookies ni await cheyali (Promise error fix)
    const cookieStore = await cookies(); 
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false }
      }
    );

    // 2. Auth token techi user ni verify cheyadam
    const authHeader = cookieStore.get('sb-access-token')?.value; 
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Database nundi connections lagadam
    const { data: connection } = await supabase
      .from('user_connections')
      .select('access_token')
      .eq('user_id', user.id)
      .eq('platform', 'facebook')
      .maybeSingle();

    if (!connection || !connection.access_token) {
      return NextResponse.json({ pages: [] });
    }

    // 4. Facebook API call
    const fbRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${connection.access_token}`);
    const fbData = await fbRes.json();
    
    return NextResponse.json({ pages: fbData.data || [] });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}