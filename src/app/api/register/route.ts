import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // లేదా నువ్వు వాడుతున్న DB క్లయింట్
import bcrypt from "bcryptjs";

// బిల్డ్ ఎర్రర్ రాకుండా ఉండటానికి ఇది కచ్చితంగా ఉండాలి
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. అన్నీ వివరాలు వచ్చాయో లేదో చెక్ చేయడం
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and Password are required" }, { status: 400 });
    }

    // 2. యూజర్ ఆల్రెడీ ఉన్నాడేమో చూడటం
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "యూజర్ ఆల్రెడీ ఉన్నాడు!" }, { status: 400 });
    }

    // 3. పాస్‌వర్డ్ ని హాష్ (Encrypt) చేయడం
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. కొత్త యూజర్ ని క్రియేట్ చేయడం
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, message: "Registration successful!", userId: user.id });

  } catch (err: any) {
    console.error("Registration Error:", err.message);
    return NextResponse.json({ success: false, error: "రిజిస్ట్రేషన్ ఫెయిల్ అయ్యింది", details: err.message }, { status: 500 });
  }
}