import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    const message = {
      text: `*New Post from PostJet* 🚀\n\n${content}`,
      attachments: mediaUrl ? [{ image_url: mediaUrl }] : [],
    };

    const response = await fetch(webhookUrl!, {
      method: "POST",
      body: JSON.stringify(message),
    });

    return response.ok 
      ? NextResponse.json({ success: true, message: "Slack Message Sent! 🐝" })
      : NextResponse.json({ success: false, error: "Slack Failed" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}