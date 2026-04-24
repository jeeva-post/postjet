import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "../../../../lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.message && body.message.text.startsWith('/start')) {
      const chatId = body.message.chat.id;
      const client = await clientPromise;
      const db = client.db("postjet");

      // టెలిగ్రామ్ ని డేటాబేస్ లో 'Active' గా అప్‌డేట్ చేయడం
      await db.collection("accounts").updateOne(
        { platform: "Telegram" }, 
        { $set: { "config.chatId": chatId, status: "Active" } },
        { upsert: true }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}