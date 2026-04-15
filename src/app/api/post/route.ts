import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, platforms, accessToken } = body;

    console.log("🚀 PostJet Blast Started for:", platforms);

    const results = [];

    // --- 1. TELEGRAM LOGIC (The Easy Success) ---
    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        results.push({ platform: "telegram", status: "error", message: "Keys missing in Vercel" });
      } else {
        const telRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: content }),
        });
        const telData = await telRes.json();
        results.push({ platform: "telegram", status: telData.ok ? "success" : "error" });
      }
    }

    // --- 2. FACEBOOK LOGIC (The Secure Way) ---
    if (platforms.includes("facebook")) {
      const pageId = process.env.FACEBOOK_PAGE_ID;
      
      if (!pageId || pageId === "undefined" || !accessToken) {
        results.push({ platform: "facebook", status: "error", message: "Page ID or Token missing" });
      } else {
        const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;
        const fbRes = await fetch(fbUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, access_token: accessToken }),
        });
        const fbData = await fbRes.json();
        results.push({ platform: "facebook", status: fbData.id ? "success" : "error" });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error("❌ Critical Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}