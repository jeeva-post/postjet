import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";
import { postToTelegram } from "@/lib/social/telegram";
import { postToInstagram } from "@/lib/social/instagram";
import { postToLinkedIn } from "@/lib/social/linkedin";
import { postToPinterest } from "@/lib/social/pinterest";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();
    
    // Media detection logic
    const isVideo = mediaUrl?.includes("/video/") || mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    
    console.log("🚀 BLAST SEQUENCE STARTED. Media Type:", isVideo ? "VIDEO" : "IMAGE");

    const tasks = [];

    // --- 1. TELEGRAM ---
    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }

    // --- 2. FACEBOOK (Working Code) ---
    if (platforms.includes("facebook")) {
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }

    // --- 3. INSTAGRAM ---
    if (platforms.includes("instagram") && mediaUrl) {
      tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    }

    // --- 4. LINKEDIN ---
    if (platforms.includes("linkedin")) {
      tasks.push(postToLinkedIn(content, mediaUrl, !!isVideo, accessToken));
    }

    // --- 5. PINTEREST ---
    if (platforms.includes("pinterest") && mediaUrl) {
      tasks.push(postToPinterest(content, mediaUrl, accessToken));
    }

    const results = await Promise.allSettled(tasks);
    
    const formatted = results.map((res: any) => 
      res.status === "fulfilled" ? res.value : { success: false, error: res.reason?.message }
    );

    console.log("✅ BLAST COMPLETED:", JSON.stringify(formatted, null, 2));

    return NextResponse.json({ success: true, results: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}