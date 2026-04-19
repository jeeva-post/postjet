export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// ఈ లైన్ వెర్సెల్ బిల్డ్ ఎర్రర్స్ (Missing Environment Variables) రాకుండా కాపాడుతుంది
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, mobile, password } = body;

    // 1. డేటా సరిగ్గా ఉందో లేదో చెక్ చేయడం
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "అన్ని వివరాలు (Name, Email, Mobile, Password) ఇవ్వాలి." },
        { status: 400 }
      );
    }

    // 2. MongoDB కనెక్ట్ అవ్వడం
    const client = await clientPromise;
    const db = client.db();

    // 3. యూజర్ ముందే ఉన్నారో లేదో చూడటం
    const existingUser = await db.collection("users").findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile: mobile }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "ఈ ఇమెయిల్ లేదా మొబైల్ నంబర్ తో ఇప్పటికే ఒక యూజర్ ఉన్నారు." },
        { status: 400 }
      );
    }

    // 4. పాస్‌వర్డ్ ని హ్యాష్ చేయడం
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. కొత్త యూజర్‌ని సేవ్ చేయడం
    const result = await db.collection("users").insertOne({
      name,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully!", userId: result.insertedId },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "సర్వర్ లో ఏదో సమస్య ఉంది, మళ్ళీ ప్రయత్నించండి." },
      { status: 500 }
    );
  }
}