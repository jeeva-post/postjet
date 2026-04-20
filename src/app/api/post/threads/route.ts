import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();

    const threadsUserId = process.env.THREADS_USER_ID;
    const accessToken = process.env.META_ACCESS_TOKEN; // నీ కామన్ టోకెన్

    // 1. Threads Media Container క్రియేట్ చేయడం
    const containerRes = await fetch(
      `https://graph.threads.net/v1.0/${threadsUserId}/threads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: mediaUrl ? "IMAGE" : "TEXT",
          text: content,
          image_url: mediaUrl,
          access_token: accessToken,
        }),
      }
    );

    const containerData = await containerRes.json();
    
    if (!containerRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: "Threads Container Failed", 
        details: containerData 
      });
    }

    // 2. క్రియేట్ అయిన పోస్ట్‌ని పబ్లిష్ చేయడం
    const publishRes = await fetch(
      `https://graph.threads.net/v1.0/${threadsUserId}/threads_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();

    if (publishRes.ok) {
      return NextResponse.json({ success: true, message: "Posted to Threads!", data: publishData });
    } else {
      return NextResponse.json({ success: false, error: "Threads Publish Failed", details: publishData });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
} 