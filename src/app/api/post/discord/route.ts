import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const payload = {
      content: content,
      embeds: mediaUrl ? [{ image: { url: mediaUrl } }] : [],
    };

    const response = await fetch(webhookUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.ok 
      ? NextResponse.json({ success: true, message: "Discord Message Sent! 👾" })
      : NextResponse.json({ success: false, error: "Discord Failed" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}