import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("RECEIVED DATA:", body); // ఇది వెర్సెల్ లాగ్స్‌లో పడాలి

    const { content, platforms } = body;

    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      console.log("Attempting Telegram Post...");
      console.log("Bot Token exists:", !!botToken);
      console.log("Chat ID:", chatId);

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: content }),
      });

      const resData = await response.json();
      console.log("TELEGRAM API RESPONSE:", resData);

      if (!resData.ok) {
        return NextResponse.json({ success: false, error: resData.description });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CRITICAL ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}