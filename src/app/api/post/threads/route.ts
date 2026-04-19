import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const threadsUserId = process.env.THREADS_USER_ID;

    // STEP 1: Container
    const res = await fetch(`https://graph.threads.net/v1.0/${threadsUserId}/threads?media_type=TEXT&text=${encodeURIComponent(content)}&access_token=${accessToken}`, { method: "POST" });
    const data = await res.json();

    if (!data.id) return NextResponse.json({ success: false, error: "Threads Container Failed" });

    // STEP 2: Publish
    const pub = await fetch(`https://graph.threads.net/v1.0/${threadsUserId}/threads_publish?creation_id=${data.id}&access_token=${accessToken}`, { method: "POST" });
    const pubData = await pub.json();

    return pubData.id ? NextResponse.json({ success: true, message: "Threads Success! 🧵" }) : NextResponse.json({ success: false });
  } catch (err: any) { return NextResponse.json({ success: false, error: err.message }); }
}