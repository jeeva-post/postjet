import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be initialized' }, { status: 500 });
    }

    const authHeader = cookieStore.get('sb-access-token')?.value; 
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: connection } = await supabase
      .from('user_connections')
      .select('access_token')
      .eq('user_id', user.id)
      .eq('platform', 'facebook')
      .maybeSingle();

    if (!connection || !connection.access_token) return NextResponse.json({ pages: [] });

    const fbRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${connection.access_token}`);
    const fbData = await fbRes.json();
    
    return NextResponse.json({ pages: fbData.data || [] });
  } catch (err) {
    return NextResponse.json({ error: "Codespace API Error" }, { status: 500 });
  }
}