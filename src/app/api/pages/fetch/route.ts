import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get Facebook token from DB
  const { data: connection } = await supabase
    .from('user_connections')
    .filter('user_id', 'eq', user.id)
    .filter('platform', 'eq', 'facebook')
    .single();

  if (!connection) return NextResponse.json({ pages: [] });

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${connection.access_token}`
    );
    const data = await response.json();
    
    return NextResponse.json({ 
      pages: data.data || [],
      error: data.error ? data.error.message : null 
    });
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}