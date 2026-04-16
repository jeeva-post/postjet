import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";
import { postToTelegram } from "@/lib/social/telegram";
import { postToInstagram } from "@/lib/social/instagram";
import { postToLinkedIn } from "@/lib/social/linkedin";
import { postToPinterest } from "@/lib/social/pinterest";
import { postToYouTube } from "@/lib/social/youtube"; // 🔥 కొత్తగా యాడ్ చేసిన YouTube Engine

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();

    // 1. ఇది వీడియోనా కాదా అని చెక్ చేయడం (Cloudinary URL లేదా ఫైల్ ఎక్స్‌టెన్షన్ బట్టి)
    const isVideo = mediaUrl?.includes("/video/") || mediaUrl?.match(/\.(mp4|mov|avi|webm)$/i);
    
    const tasks = [];

    // --- పాత సెట్టింగ్స్ (ఏ మార్పు లేదు) ---

    // 2. Telegram
    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }

    // 3. Facebook
    if (platforms.includes("facebook")) {
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }

    // 4. Instagram (వీడియో లేదా ఫోటో ఉంటేనే)
    if (platforms.includes("instagram") && mediaUrl) {
      tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    }

    // 5. LinkedIn
    if (platforms.includes("linkedin")) {
      tasks.push(postToLinkedIn(content, mediaUrl, !!isVideo, accessToken));
    }

    // 6. Pinterest (ఇమేజ్ ఉంటేనే)
    if (platforms.includes("pinterest") && mediaUrl) {
      tasks.push(postToPinterest(content, mediaUrl, accessToken));
    }

    // --- కొత్తగా యాడ్ చేసిన YouTube Logic ---

    // 7. YouTube (వీడియో ఫైల్ ఉంటేనే అప్‌లోడ్ అవుతుంది)
    if (platforms.includes("youtube") && mediaUrl && isVideo) {
      tasks.push(postToYouTube(content, mediaUrl, accessToken));
    }

    // 8. అన్ని ప్లాట్‌ఫారమ్స్ కి ఒకేసారి రిక్వెస్ట్ పంపడం
    const results = await Promise.allSettled(tasks);

    // 9. రిజల్ట్స్ ని ఫార్మాట్ చేయడం
    const formattedResults = results.map((res: any) => 
      res.status === "fulfilled" ? res.value : { success: false, error: res.reason?.message || "Unknown Error" }
    );

    return NextResponse.json({ 
      success: true, 
      results: formattedResults 
    });

  } catch (error: any) {
    console.error("Main API Route Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}