import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const token = process.env.LINKEDIN_CLIENT_SECRET;

    // మెంబర్ ఐడీని కనుక్కోవడం
    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${meData.id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
            media: mediaUrl ? [{ status: "READY", media: mediaUrl, title: { text: "PostJet" } }] : undefined,
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });

    return res.status === 201 ? NextResponse.json({ success: true }) : NextResponse.json({ success: false });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }); }
}