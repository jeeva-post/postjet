import { NextResponse } from "next/server";
import { postToInstagram } from "@/lib/social/instagram";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, accessToken } = await req.json();
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    // ఇది వీడియోని అప్‌లోడ్ చేసి Container ID ని ఇస్తుంది
    const result = await postToInstagram(content, mediaUrl, !!isVideo, accessToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}