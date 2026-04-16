import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ success: false, error: "Vercel Variables Missing" }, { status: 400 });
    }

    // --- Media Type Detection (Improved) ---
    // Cloudinary లింక్స్ లో ఒక్కోసారి చివర ఎక్స్‌టెన్షన్ ఉండదు, అందుకే "image/upload" లేదా "video/upload" ఉన్నాయో లేదో చూస్తున్నాం.
    const isVideo = mediaUrl?.toLowerCase().match(/\.(mp4|mov|avi|webm)$/) || mediaUrl?.includes("/video/upload/");
    const isImage = mediaUrl?.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) || mediaUrl?.includes("/image/upload/");

    let payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
    };

    if (mediaUrl && isVideo) {
      // 🎥 వీడియో లాజిక్
      payload.type = "video";
      payload.video = {
        link: mediaUrl,
        caption: content || ""
      };
    } else if (mediaUrl && isImage) {
      // 🖼️ ఇమేజ్ లాజిక్
      payload.type = "image";
      payload.image = {
        link: mediaUrl,
        caption: content || ""
      };
    } else {
      // 📝 కేవలం టెక్స్ట్ లాజిక్
      payload.type = "text";
      payload.text = {
        preview_url: true,
        body: content ? `${content}${mediaUrl ? `\n\nLink: ${mediaUrl}` : ""}` : (mediaUrl || "")
      };
    }

    console.log(`🚀 Final Payload being sent to WhatsApp:`, JSON.stringify(payload));

    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.error) {
      console.error("❌ Meta API Error:", data.error);
      return NextResponse.json({ success: false, error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: data.messages[0].id });

  } catch (error: any) {
    console.error("❌ System Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}