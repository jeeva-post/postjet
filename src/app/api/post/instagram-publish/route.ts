import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { igUserId, creationId, accessToken } = await req.json();
    console.log("🚀 Publishing IG Media:", creationId);

    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );

    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(publishData.error.message);

    return NextResponse.json({ success: true, id: publishData.id });
  } catch (err: any) {
    console.error("❌ Publish Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}