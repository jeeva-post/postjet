import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const recipient = process.env.WHATSAPP_RECIPIENT_ID;

    // 1. Keys ఉన్నాయో లేదో స్ట్రిక్ట్ చెక్
    if (!phoneId || !token || !recipient) {
      return NextResponse.json({ 
        success: false, 
        error: "Vercel Environment Variables (PhoneID/Token/Recipient) missing!" 
      }, { status: 400 });
    }

    console.log(`🚀 Sending Template Message to: ${recipient}`);

    // 2. Meta API Call - Using 'hello_world' template for 100% delivery
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      })
    });

    const data = await res.json();

    // 3. ఒకవేళ Meta ఎర్రర్ పంపితే (Like: Token expired or Number not whitelisted)
    if (data.error) {
      console.error("❌ Meta Error Details:", data.error);
      return NextResponse.json({ 
        success: false, 
        error: `Meta Error: ${data.error.message} (Code: ${data.error.code})` 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: data.messages[0].id });

  } catch (error: any) {
    console.error("❌ System Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}