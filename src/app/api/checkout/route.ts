import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
  }

  const cookieStore = await cookies();
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client could not be initialized' }, { status: 500 });
  }

  const authHeader = cookieStore.get('sb-access-token')?.value;
  const { data: { user } } = await supabase.auth.getUser(authHeader);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Lemon Squeezy Checkout API call
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { email: user.email },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
          }
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMON_SQUEEZY_STORE_ID } },
          variant: { data: { type: 'variants', id: process.env.LEMON_SQUEEZY_VARIANT_ID } }
        }
      }
    })
  });

  const checkout = await response.json();
  return NextResponse.json({ url: checkout.data.attributes.url });
}