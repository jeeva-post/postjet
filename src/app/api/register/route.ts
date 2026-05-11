import { NextResponse } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase environment variables are missing' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client could not be initialized' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, mobile } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User registered successfully!", data },
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