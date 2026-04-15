import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";
import { postToTelegram } from "@/lib/social/telegram";
import { postToInstagram } from "@/lib/social/instagram"; // కొత్త ఇంపోర్ట్

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, platforms, accessToken, mediaUrl } = body;

    // మీడియా టైప్ ని చెక్ చేయడం
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    console.log("🚀 BLAST SEQUENCE STARTED for platforms:", platforms);

    const tasks = [];

    // --- 1. TELEGRAM (దీన్ని మనం మార్చలేదు) ---
    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }

    // --- 2. FACEBOOK (నీకు సక్సెస్ అయిన పాత కోడ్ ఇదే, దీన్ని అస్సలు ముట్టుకోలేదు) ---
    if (platforms.includes("facebook")) {
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }

    // --- 3. INSTAGRAM (కొత్తగా పక్కన అమర్చాం) ---
    // గమనిక: ఇన్స్టాగ్రామ్ కి మీడియా URL కచ్చితంగా ఉండాలి
    if (platforms.includes("instagram") && mediaUrl) {
      tasks.push(postToInstagram(content, mediaUrl, !!isVideo, accessToken));
    }

    // అన్ని ప్లాట్‌ఫారమ్స్ పనులు ఒకేసారి మొదలవుతాయి
    const results = await Promise.allSettled(tasks);

    // ఫలితాలను మనకు అర్థమయ్యేలా మార్చడం
    const formattedResults = results.map((res: any) => {
      if (res.status === "fulfilled") {
        return res.value;
      } else {
        return { 
          success: false, 
          error: res.reason?.message || "Internal Engine Error" 
        };
      }
    });

    console.log("✅ BLAST REPORT:", JSON.stringify(formattedResults, null, 2));

    return NextResponse.json({ 
      success: true, 
      results: formattedResults 
    });

  } catch (error: any) {
    console.error("Fatal API Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}