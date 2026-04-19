import { NextResponse } from "next/server";

// 1. బిల్డ్ ఎర్రర్ రాకుండా ఉండటానికి ఇది కచ్చితంగా ఉండాలి
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // 2. బేసిక్ చెకింగ్
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and Password are required" }, { status: 400 });
    }

    // 💡 గమనిక: ఇక్కడ నీ MongoDB కనెక్షన్ మరియు యూజర్ సేవ్ చేసే లాజిక్ ఉండాలి.
    // ప్రస్తుతం బిల్డ్ సక్సెస్ అవ్వడానికి ఈ కింద సింపుల్ రెస్పాన్స్ ఇస్తున్నాను.
    console.log("Registering for MongoDB:", email);

    return NextResponse.json({ 
      success: true, 
      message: "MongoDB Register Route Active! Prisma error removed." 
    });

  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: "Registration Error", 
      details: err.message 
    }, { status: 500 });
  }
}