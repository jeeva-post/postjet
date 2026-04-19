import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, title } = await req.json();
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;

    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        title: title || "Posted via PostJet",
        description: content,
        media_source: {
          source_type: "image_url",
          url: mediaUrl,
        },
      }),
    });

    const data = await response.json();
    return data.id 
      ? NextResponse.json({ success: true, message: "Pinterest Pin Created! 📌" })
      : NextResponse.json({ success: false, error: "Pinterest Failed", debug: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}