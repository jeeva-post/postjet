import { NextResponse } from "next/server";

// 1. GET Method: ఇది ఫేస్‌బుక్ వెరిఫికేషన్ (Handshake) కోసం
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Vercel Settings లో నువ్వు ఇచ్చే రహస్య కోడ్ (Verify Token)
  const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Facebook Webhook Verified!");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Verification Failed", { status: 403 });
}

// 2. POST Method: ఇది అసలైన డేటా (Likes/Comments) వచ్చినప్పుడు
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ఇక్కడ ఫేస్‌బుక్ నుండి వచ్చిన డేటాను లాగ్ చేస్తున్నాం
    console.log("📩 New Webhook Event:", JSON.stringify(body, null, 2));

    // నువ్వు ఫ్యూచర్ లో ఇక్కడ డేటాబేస్ అప్‌డేట్ లాజిక్ రాసుకోవచ్చు
    // ఉదాహరణకి: ఒక పోస్ట్‌కి లైక్ వస్తే నీ డ్యాష్‌బోర్డ్ లో చూపించడం

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}