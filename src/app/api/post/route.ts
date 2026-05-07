import { NextRequest, NextResponse } from "next/server";
import { platformHandlers } from "./platforms"; 

export async function POST(req: NextRequest) {
  try {
    const { platform, content, mediaUrl } = await req.json();

    if (!platform || !content) {
      return NextResponse.json({ error: "Platform and Content are required" }, { status: 400 });
    }

    // Index.ts nundi correct app handler ni automatic ga select chestundi
    const handler = platformHandlers[platform.toLowerCase()];

    if (!handler) {
      return NextResponse.json({ error: `Platform '${platform}' not integrated yet.` }, { status: 400 });
    }

    const result = await handler(content, mediaUrl);

    return NextResponse.json({ success: true, platform, data: result });

  } catch (error: any) {
    console.error(`[API ERROR]:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}