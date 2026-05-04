import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.text();
  console.log("Payment webhook received", payload.slice(0, 200));
  return NextResponse.json({ success: true });
}
