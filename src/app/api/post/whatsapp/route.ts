import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ success: false, error: "Keys Missing!" }, { status: 400 });
    }

    const safeContent = content || "";
    const url = mediaUrl?.toLowerCase() || "";

    // --- Media Detection (Bulletproof Version) ---
    // లింక్ లో ఎక్కడ 'video' అని ఉన్నా లేదా .mp4 ఉన్నా అది వీడియో కింద లెక్క
    const isVideo = url.includes(".mp4") || url.includes(".mov") || url.includes("/video/upload");
    // లింక్ లో ఎక్కడ 'image' అని ఉన్నా లేదా .jpg, .png ఉన్నా అది ఇమేజ్
    const isImage = url.includes(".jpg") || url.includes(".jpeg") || url.includes(".png") || url.includes(".webp") || url.includes("/image/upload");

    let payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
    };

    if (mediaUrl && isVideo) {
      payload.type = "video";
      payload.video = { link: mediaUrl, caption: safeContent.substring(0, 1000) };
    } else if (mediaUrl && isImage) {
      payload.type = "image";
      payload.image = { link: mediaUrl, caption: safeContent.substring(0, 1000) };
    } else {
      // ఏమీ లేకపోతే కేవలం టెక్స్ట్
      payload.type = "text";
      payload.text = { 
        preview_url: true, 
        body: (safeContent + (mediaUrl ? `\n\n${mediaUrl}` : "")).substring(0, 4000) 
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
      // కేవలం మెయిన్ ఎర్రర్ మాత్రమే చూపిస్తున్నాం, పెద్ద కోడ్ రాదు
      return NextResponse.json({ success: false, error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}