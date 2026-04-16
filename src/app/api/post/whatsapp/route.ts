import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ success: false, error: "Variables missing in Vercel!" });
    }

    // Cloudinary లింక్ ని క్లీన్ గా చెక్ చేయడం
    const url = mediaUrl ? mediaUrl.trim() : "";
    const isVideo = url.toLowerCase().includes("video") || url.toLowerCase().endsWith(".mp4");
    const isImage = url.toLowerCase().includes("image") || url.toLowerCase().includes("upload") || /\.(jpg|jpeg|png|webp)$/i.test(url);

    let payload: any = {
      messaging_product: "whatsapp",
      to: recipient,
    };

    if (url && (isImage || isVideo)) {
      const type = isVideo ? "video" : "image";
      payload.type = type;
      payload[type] = { 
        link: url, 
        caption: (content || "").substring(0, 1000) 
      };
    } else {
      payload.type = "text";
      payload.text = { body: (content || url).substring(0, 4000) };
    }

    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.error) {
      // ఇక్కడ ఆ పెద్ద కోడ్ రాకుండా కేవలం మెసేజ్ మాత్రమే పంపిస్తున్నాను
      console.error("Meta Error:", data.error);
      return NextResponse.json({ 
        success: false, 
        error: `Meta rejected: ${data.error.message}` 
      });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server error occurred" });
  }
}