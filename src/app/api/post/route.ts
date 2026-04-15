import { NextResponse } from "next/server";
import { postToFacebook } from "@/lib/social/facebook";
import { postToTelegram } from "@/lib/social/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, platforms, accessToken, mediaUrl } = body;
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    console.log("🚀 BLAST STARTED for platforms:", platforms);

    const tasks = [];
    if (platforms.includes("telegram")) {
      tasks.push(postToTelegram(content, mediaUrl, !!isVideo));
    }
    if (platforms.includes("facebook")) {
      tasks.push(postToFacebook(content, mediaUrl, !!isVideo, accessToken));
    }

    const results = await Promise.allSettled(tasks);

    // ఎర్రర్స్ ని రీడబుల్ గా మార్చడం
    const formattedResults = results.map((res: any) => {
      if (res.status === "fulfilled") return res.value;
      return { success: false, error: res.reason?.message || "Internal Server Error" };
    });

    console.log("✅ BLAST COMPLETED:", JSON.stringify(formattedResults, null, 2));
    return NextResponse.json({ success: true, results: formattedResults });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}