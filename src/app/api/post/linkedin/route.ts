import { NextResponse } from "next/server";
import { postToLinkedIn } from "@/lib/social/linkedin";

export async function POST(req: Request) {
  const { content, mediaUrl, accessToken } = await req.json();
  const res = await postToLinkedIn(content, mediaUrl, false, accessToken);
  return NextResponse.json(res);
}