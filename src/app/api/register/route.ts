import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. రిక్వెస్ట్ బాడీ నుండి డేటా తీసుకోవడం
    const body = await req.json();
    const { name, email, mobile, password } = body;

    // 2. బేసిక్ వాలిడేషన్ (ఏ ఒక్కటి మిస్ అయినా ఎర్రర్ ఇస్తుంది)
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "అన్ని ఫీల్డ్స్ (Name, Email, Mobile, Password) తప్పనిసరి!" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // 3. యూజర్ ముందే ఉన్నారో లేదో చెక్ చేయడం (Email లేదా Mobile తో)
    const existingUser = await db.collection("users").findOne({ 
      $or: [{ email: email.toLowerCase() }, { mobile: mobile }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "ఈ ఇమెయిల్ లేదా మొబైల్ నంబర్ తో ఇప్పటికే యూజర్ ఉన్నారు!" },
        { status: 400 }
      );
    }

    // 4. పాస్‌వర్డ్ హ్యాష్ చేయడం (Security కోసం)
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
      { error: "రిజిస్ట్రేషన్ ఫెయిల్ అయ్యింది: " + (error.message || "Internal Error") },
      { status: 500 }
    );
  }
}