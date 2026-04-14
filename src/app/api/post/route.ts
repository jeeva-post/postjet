import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms } = await req.json();

    console.log("PostJet processing post for:", platforms);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID; // నీ ఛానల్ @username లేదా ID

    if (platforms.includes("telegram")) {
      if (!botToken || !chatId) {
        return NextResponse.json({ success: false, error: "Telegram keys are missing in Vercel!" });
      }

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: content,
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.description || "Telegram API Error");
      }
    }

    // ఫ్యూచర్ లో Facebook/Instagram ఇక్కడ యాడ్ చేస్తాం
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Post Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}