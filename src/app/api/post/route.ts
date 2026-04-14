import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken } = await req.json();

    // 1. Telegram Posting
    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (botToken && chatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: content }),
        });
      }
    }

    // 2. Facebook Posting
    if (platforms.includes("facebook") && accessToken) {
      // ఇక్కడ మనం యూజర్ కనెక్ట్ చేసినప్పుడు వచ్చిన టోకెన్ వాడుతున్నాం
      const pageId = process.env.FACEBOOK_PAGE_ID; 
      const fbUrl = `https://graph.facebook.com/${pageId}/feed?message=${encodeURIComponent(content)}&access_token=${accessToken}`;
      await fetch(fbUrl, { method: "POST" });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}