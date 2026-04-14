import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms } = await req.json();
    console.log("PostJet processing for:", platforms);

    // 1. Facebook Posting Logic
    if (platforms.includes("facebook")) {
      const fbAccessToken = process.env.FACEBOOK_ACCESS_TOKEN; // నీ పేజీ టోకెన్
      const pageId = process.env.FACEBOOK_PAGE_ID; // నీ పేజీ ఐడి

      if (!fbAccessToken || !pageId) {
        console.error("FB Credentials missing!");
      } else {
        const fbUrl = `https://graph.facebook.com/${pageId}/feed?message=${encodeURIComponent(content)}&access_token=${fbAccessToken}`;
        const fbRes = await fetch(fbUrl, { method: "POST" });
        const fbData = await fbRes.json();
        console.log("Facebook Response:", fbData);
      }
    }

    // 2. Telegram Posting Logic
    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: content }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}