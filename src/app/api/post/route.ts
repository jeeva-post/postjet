import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";
import { postToTelegram } from "@/lib/social/telegram";
import { postToInstagram } from "@/lib/social/instagram";
import { postToLinkedIn } from "@/lib/social/linkedin";
import { postToPinterest } from "@/lib/social/pinterest";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();
    const isVideo = mediaUrl?.includes("/video/") || mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    const tasks = [];

    if (platforms.includes("telegram")) tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    if (platforms.includes("facebook")) tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    if (platforms.includes("instagram") && mediaUrl) tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    if (platforms.includes("linkedin")) tasks.push(postToLinkedIn(content, mediaUrl, !!isVideo, accessToken));
    if (platforms.includes("pinterest") && mediaUrl) tasks.push(postToPinterest(content, mediaUrl, accessToken));

    const results = await Promise.allSettled(tasks);
    const formatted = results.map((res: any) => res.status === "fulfilled" ? res.value : { success: false, error: res.reason?.message });

    return NextResponse.json({ success: true, results: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}