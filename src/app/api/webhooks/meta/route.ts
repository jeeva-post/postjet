import { NextResponse } from "next/server";

// 1. GET Method: మెటా వెరిఫికేషన్ కోసం (Handshake)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // నీ సీక్రెట్ వెరిఫై టోకెన్ (మెటా డాష్‌బోర్డ్‌లో ఇచ్చిందే ఇక్కడ ఉండాలి)
    const MY_VERIFY_TOKEN = "PostJet_Secret_Verification_123";

    if (mode === "subscribe" && token === MY_VERIFY_TOKEN) {
      console.log("✅ Meta Webhook Verified Successfully!");
      // మెటాకి తిరిగి 'challenge' స్ట్రింగ్ పంపాలి
      return new Response(challenge, { status: 200 });
    }

    console.error("❌ Webhook Verification Failed: Token Mismatch");
    return new Response("Verification failed", { status: 403 });
  } catch (error) {
    return new Response("Internal Error", { status: 500 });
  }
}

// 2. POST Method: ఇన్‌స్టాగ్రామ్/వాట్సాప్ నుండి డేటా రిసీవ్ చేసుకోవడానికి
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ఇక్కడ మెటా పంపే నోటిఫికేషన్ డేటా ఉంటుంది
    console.log("📩 Received Webhook Event:", JSON.stringify(body, null, 2));

    // మెటా కి "మేము డేటా తీసుకున్నాం" అని 200 OK చెప్పాలి
    return NextResponse.json({ status: "received" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Webhook POST Error:", error.message);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}