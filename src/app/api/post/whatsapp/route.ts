import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ success: false, error: "Settings missing in Vercel" });
    }

    const url = mediaUrl ? mediaUrl.trim() : "";
    const isVideo = url.toLowerCase().includes("video") || url.toLowerCase().endsWith(".mp4");
    const isImage = url.toLowerCase().includes("image") || url.toLowerCase().includes("upload") || /\.(jpg|jpeg|png|webp)$/i.test(url);

    let payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
    };

    if (url && (isImage || isVideo)) {
      const type = isVideo ? "video" : "image";
      payload.type = type;
      payload[type] = { 
        link: url, 
        caption: (content || "").substring(0, 1000) // వాట్సాప్ మీడియా క్యాప్షన్ లిమిట్ 1024
      };
    } else {
      payload.type = "text";
      payload.text = { body: (content || url).substring(0, 4000) };
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