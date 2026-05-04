import { NextResponse } from "next/server";
import { handlePostRequest } from "@/lib/post-controller";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const result = await handlePostRequest(payload);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}
