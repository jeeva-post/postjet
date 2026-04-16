import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { igUserId, creationId, accessToken } = await req.json();
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}