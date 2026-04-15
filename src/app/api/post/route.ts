import { NextResponse } from "next/server";
import { postToTelegram } from "@/lib/social/telegram";
import { postToFacebook } from "@/lib/social/facebook";
import { postToYouTube } from "@/lib/social/youtube";
import { postToInstagram } from "@/lib/social/instagram"; // కొత్తగా యాడ్ చేసాం

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    const tasks = [];

    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }
    if (platforms.includes("facebook")) {
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }
    if (platforms.includes("instagram") && mediaUrl) {
      tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    }
    if (platforms.includes("youtube") && isVideo) {
      tasks.push(postToYouTube(content, mediaUrl, accessToken));
    }

    const finalResults = await Promise.allSettled(tasks);
    
    return NextResponse.json({ success: true, results: finalResults });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}