import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ success: false, error: "Telegram keys missing!" });
    }

    let url = `https://api.telegram.org/bot${botToken}/`;
    let body: any = { chat_id: chatId };

    if (mediaUrl) {
      const isVideo = mediaUrl.toLowerCase().includes("video") || mediaUrl.toLowerCase().endsWith(".mp4");
      url += isVideo ? "sendVideo" : "sendPhoto";
      body[isVideo ? "video" : "photo"] = mediaUrl;
      body["caption"] = content || "";
    } else {
      url += "sendMessage";
      body["text"] = content || "Empty message";
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    if (!data.ok) {
      return NextResponse.json({ success: false, error: data.description || "Telegram Error" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Telegram API unreachable" });
  }
}