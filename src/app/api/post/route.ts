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

    // 🕵️‍♂️ Debug Logs (ఏం జరుగుతుందో చూడటానికి)
    console.log("📡 API Received Platforms:", platforms);
    
    // వీడియోనా కాదా అని కన్ఫర్మ్ చేయడం
    const isVideo = mediaUrl?.includes("/video/") || mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    
    const tasks = [];

    // --- పాత సెట్టింగ్స్ (No Changes) ---

    // 1. Telegram
    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }

    // 2. Facebook
    if (platforms.includes("facebook")) {
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }

    // 3. Instagram (ఇక్కడ మనం కొత్తగా రాసిన Async ఇంజిన్ రన్ అవుతుంది)
    if (platforms.includes("instagram") && mediaUrl) {
      tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    }

    // 4. LinkedIn
    if (platforms.includes("linkedin")) {
      tasks.push(postToLinkedIn(content, mediaUrl, !!isVideo, accessToken));
    }

    // 5. Pinterest
    if (platforms.includes("pinterest") && mediaUrl) {
      tasks.push(postToPinterest(content, mediaUrl, accessToken));
    }

    // 6. YouTube (ఇందాక సక్సెస్ అయిన సెట్టింగ్స్)
    if (platforms.includes("youtube") && mediaUrl && isVideo) {
      tasks.push(postToYouTube(content, mediaUrl, accessToken));
    }

    // అన్ని ప్లాట్‌ఫారమ్స్ ని ఒకేసారి రన్ చేయడం
    const results = await Promise.allSettled(tasks);

    // రిజల్ట్స్ ని ఫార్మాట్ చేయడం
    const formattedResults = results.map((res: any) => 
      res.status === "fulfilled" ? res.value : { success: false, error: res.reason?.message || "Unknown Error" }
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