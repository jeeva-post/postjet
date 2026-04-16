import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ success: false, error: "Settings Missing" }, { status: 400 });
    }

    const safeUrl = mediaUrl ? mediaUrl.trim() : "";
    const isVideo = safeUrl.toLowerCase().includes("video") || safeUrl.toLowerCase().endsWith(".mp4");
    const isImage = safeUrl.toLowerCase().includes("image") || safeUrl.toLowerCase().includes("upload") || /\.(jpg|jpeg|png|webp)$/i.test(safeUrl);

    let payload: any = {
      messaging_product: "whatsapp",
      to: recipient,
    };

    if (safeUrl && (isImage || isVideo)) {
      const type = isVideo ? "video" : "image";
      payload.type = type;
      payload[type] = { 
        link: encodeURI(safeUrl), 
        caption: (content || "").substring(0, 1000) 
      };
    } else {
      payload.type = "text";
      payload.text = { body: (content || safeUrl).substring(0, 4000) };
    }

    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.error) return NextResponse.json({ success: false, error: data.error.message });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}