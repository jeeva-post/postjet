export async function POST(req: Request) {
  const payload = await req.json();
  const userId = payload.meta.custom_data.user_id;
  const eventName = payload.data.attributes.event_name;

  if (eventName === 'subscription_created' || eventName === 'order_created') {
    // Supabase lo user status update cheyali
    const { error } = await supabase
      .from('profiles')
      .update({ 
        plan_type: 'Pro', 
        subscription_status: 'active' 
      })
      .eq('id', userId);
  }

  return NextResponse.json({ received: true });
}