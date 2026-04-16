import { NextResponse } from "next/server";
import { postToYouTube } from "@/lib/social/youtube";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, accessToken } = await req.json();
    const result = await postToYouTube(content, mediaUrl, accessToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}