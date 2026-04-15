import { NextResponse } from "next/server";
import { postToTelegram } from "@/lib/social/telegram";
import { postToFacebook } from "@/lib/social/facebook";
import { postToYouTube } from "@/lib/social/youtube";
import { postToInstagram } from "@/lib/social/instagram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, platforms, accessToken, mediaUrl } = body;

    // 🔥 నువ్వు అడిగిన DEBUG LOG - వెర్సెల్ లాగ్స్ లో ఇది కనిపిస్తుంది
    console.log("-----------------------------------------");
    console.log("🚀 BLAST SEQUENCE STARTED");
    console.log("Token reaching backend:", accessToken ? "✅ YES (Starts with: " + accessToken.substring(0, 10) + "...)" : "❌ NO");
    console.log("Platforms selected:", platforms);
    console.log("-----------------------------------------");

    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    const tasks = [];

    // 1. Telegram (No Token Needed)
    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }

    // 2. Facebook (Needs Token)
    if (platforms.includes("facebook")) {
      if (!accessToken) {
        console.error("FB Failed: No Access Token provided!");
      } else {
        tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
      }
    }

    // 3. Instagram (Needs Token)
    if (platforms.includes("instagram") && mediaUrl) {
      if (!accessToken) {
        console.error("IG Failed: No Access Token provided!");
      } else {
        tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
      }
    }

    // 4. YouTube (Needs Token & Video)
    if (platforms.includes("youtube") && isVideo) {
      if (!accessToken) {
        console.error("YouTube Failed: No Access Token provided!");
      } else {
        tasks.push(postToYouTube(content, mediaUrl, accessToken));
      }
    }

    // అన్ని ప్లాట్‌ఫారమ్స్ ఒకేసారి రన్ అవుతాయి (ఒకటి ఫెయిల్ అయినా ఇంకోటి ఆగదు)
    const finalResults = await Promise.allSettled(tasks);
    
    // లాగ్స్ లో రిజల్ట్స్ చూడటానికి
    console.log("Final Blast Results:", JSON.stringify(finalResults, null, 2));

    return NextResponse.json({ 
      success: true, 
      results: finalResults 
    });

  } catch (error: any) {
    console.error("Fatal API Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}