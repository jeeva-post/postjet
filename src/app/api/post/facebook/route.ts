import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, accessToken } = await req.json();
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    const result = await postToFacebook(content, mediaUrl, !!isVideo, accessToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}