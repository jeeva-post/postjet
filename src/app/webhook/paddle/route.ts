import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: Service role vaadali
);

export async function POST(req: Request) {
  const body = await req.json();
  
  // Payment success ayithe
  if (body.event_type === 'transaction.completed') {
    const customerEmail = body.data.customer_id; // Leda email
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_pro: true })
      .eq('email', customerEmail);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}