import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "../../../../lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.message && body.message.text.startsWith('/start')) {
      const chatId = body.message.chat.id;
      const client = await clientPromise;
      const db = client.db("postjet");

      // DB లో అకౌంట్ ని Active చెయ్యడం
      await db.collection("accounts").updateOne(
        { platform: "Telegram" }, 
        { $set: { "config.chatId": chatId, status: "Active" } },
        { upsert: true }
      );

      // టెలిగ్రామ్ బాట్ లో యూజర్ కి రిప్లై పంపడం
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🚀 PostJet Connected Successfully! Click below to return to your dashboard.",
          reply_markup: {
            inline_keyboard: [[
              { text: "🔙 Back to PostJet", url: "https://postjet.vercel.app/dashboard/accounts" }
            ]]
          }
        })
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}