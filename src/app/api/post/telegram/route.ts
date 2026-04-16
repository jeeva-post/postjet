import { NextResponse } from "next/server";
import { postToTelegram } from "@/lib/social/telegram";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    const result = await postToTelegram(content, mediaUrl, !!isVideo);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}