import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, title } = await req.json();
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;

    if (!accessToken || !boardId) {
      return NextResponse.json({ success: false, error: "Pinterest Config Missing (Token/Board ID)" });
    }

    console.log("--- Pinterest Posting Attempt ---");

    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        title: title || "Posted via PostJet",
        description: content || "Check out this post!",
        media_source: {
          source_type: "image_url",
          url: mediaUrl, // Pinterest కచ్చితంగా పబ్లిక్ ఇమేజ్ లింక్ అడుగుతుంది
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Pinterest Success:", data.id);
      return NextResponse.json({ success: true, message: "Pinterest Pin Created! 📌", id: data.id });
    } else {
      console.error("❌ Pinterest Error Details:", JSON.stringify(data, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: data.message || "Pinterest Post Failed", 
        debug: data 
      });
    }

  } catch (err: any) {
    console.error("🔥 Pinterest Critical Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}