import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const action = body?.action || "connect";
  return NextResponse.json({ success: true, message: `${action.charAt(0).toUpperCase() + action.slice(1)}ed discord integration successfully.` });
}
