import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ success: false, error: "Environment variables missing!" }, { status: 400 });
    }

    const safeContent = content || "";
    const isVideo = mediaUrl?.toLowerCase().match(/\.(mp4|mov|avi|webm)$/) || mediaUrl?.includes("/video/upload/");
    const isImage = mediaUrl?.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) || mediaUrl?.includes("/image/upload/");

    let payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
    };

    if (mediaUrl && (isImage || isVideo)) {
      // 🖼️/🎥 మీడియా ఉంటే: వాట్సాప్ రూల్ ప్రకారం క్యాప్షన్ 1024 అక్షరాల లోపే ఉండాలి.
      const type = isVideo ? "video" : "image";
      payload.type = type;
      payload[type] = {
        link: mediaUrl,
        caption: safeContent.substring(0, 1020) // ఎర్రర్ రాకుండా 1020 కి కట్ చేస్తున్నాం.
      };
    } else {
      // 📝 కేవలం టెక్స్ట్ ఉంటే: వాట్సాప్ రూల్ ప్రకారం బాడీ 4096 అక్షరాల లోపే ఉండాలి.
      payload.type = "text";
      payload.text = {
        preview_url: true,
        body: (safeContent + (mediaUrl ? `\n\nLink: ${mediaUrl}` : "")).substring(0, 4090)
      };
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
      return NextResponse.json({ success: false, error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: data.messages[0].id });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}