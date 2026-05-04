import { NextResponse } from "next/server";
import Stripe from "stripe";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  const body = await req.json();
  const plan = body?.plan || "pro";
  const amount = plan === "enterprise" ? 9900 : 2900;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: `${plan.toUpperCase()} Plan` }, unit_amount: amount }, quantity: 1 }],
      mode: "payment",
      success_url: `${baseUrl}/subscription?success=true`,
      cancel_url: `${baseUrl}/subscription?canceled=true`,
    });
    return NextResponse.json({ success: true, provider: "stripe", url: session.url });
  }

  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({ amount, currency: "USD", receipt: `postjet-${plan}-${Date.now()}` });
    return NextResponse.json({ success: true, provider: "razorpay", order });
  }

  return NextResponse.json({ success: false, error: "Payment provider is not configured." }, { status: 500 });
}
