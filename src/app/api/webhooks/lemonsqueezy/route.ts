import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const eventName = body.meta.event_name; // e.g., 'subscription_created'
  const email = body.data.attributes.user_email;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (eventName === 'subscription_created' || eventName === 'order_created') {
    // User ni email dwara ethukuni, subscription status update cheyali
    const { data: user } = await supabase.from('profiles').select('id').eq('email', email).single();

    if (user) {
      await supabase
        .from('subscriptions')
        .upsert({ 
          user_id: user.id, 
          status: 'active',
          variant_id: body.data.attributes.variant_id 
        });
    }
  }

  return NextResponse.json({ received: true });
}