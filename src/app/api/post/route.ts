import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";
import { postToTelegram } from "@/lib/social/telegram";
import { postToInstagram } from "@/lib/social/instagram";
import { postToLinkedIn } from "@/lib/social/linkedin";
import { postToPinterest } from "@/lib/social/pinterest";
import { postToYouTube } from "@/lib/social/youtube";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();

    // 🕵️‍♂️ Debug Log: ఫ్రంటెండ్ నుండి ఏయే యాప్స్ వస్తున్నాయో ఇక్కడ కనిపిస్తుంది
    console.log("📡 API Received Platforms:", platforms);
    console.log("🎥 Media URL:", mediaUrl);

    // వీడియోనా కాదా అని చెక్ చేయడం
    const isVideo = mediaUrl?.includes("/video/") || mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    
    const tasks = [];

    // 1. Telegram (No changes to old settings)
    if (platforms.includes("telegram")) {
      console.log("Adding Telegram Task...");
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }

    // 2. Facebook (No changes to old settings)
    if (platforms.includes("facebook")) {
      console.log("Adding Facebook Task...");
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }

    // 3. Instagram (Strict Check: Platforms లో ఉంటేనే రన్ అవుతుంది)
    if (platforms.includes("instagram") && mediaUrl) {
      console.log("Adding Instagram Task...");
      tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    }

    // 4. LinkedIn (No changes)
    if (platforms.includes("linkedin")) {
      console.log("Adding LinkedIn Task...");
      tasks.push(postToLinkedIn(content, mediaUrl, !!isVideo, accessToken));
    }

    // 5. Pinterest (No changes)
    if (platforms.includes("pinterest") && mediaUrl) {
      console.log("Adding Pinterest Task...");
      tasks.push(postToPinterest(content, mediaUrl, accessToken));
    }

    // 6. YouTube (కొత్తగా యాడ్ చేసిన పక్కా లాజిక్)
    if (platforms.includes("youtube") && mediaUrl && isVideo) {
      console.log("Adding YouTube Task...");
      tasks.push(postToYouTube(content, mediaUrl, accessToken));
    }

    // అన్ని ప్లాట్‌ఫారమ్స్ ని ఒకేసారి రన్ చేయడం
    const results = await Promise.allSettled(tasks);

    // రిజల్ట్స్ ని ఫార్మాట్ చేయడం
    const formattedResults = results.map((res: any) => 
      res.status === "fulfilled" ? res.value : { success: false, error: res.reason?.message || "Unknown Platform Error" }
    );

    // కనీసం ఒక్కటైనా సక్సెస్ అయిందో లేదో చూడటం
    const hasAnySuccess = formattedResults.some(r => r.success);

    return NextResponse.json({ 
      success: hasAnySuccess, 
      results: formattedResults 
    });

  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}