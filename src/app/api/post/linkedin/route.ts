import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const token = process.env.LINKEDIN_CLIENT_SECRET;

    // 1. మెంబర్ ఐడీని కనుక్కోవడం (Debug Mode)
    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const meData = await meRes.json();

    // ఒకవేళ ఐడీ దొరకకపోతే ఇక్కడే ఆగిపోయి ఎర్రర్ చూపిస్తుంది
    if (!meRes.ok) {
      console.log("LinkedIn API Error Details:", meData); // ఇది టెర్మినల్‌లో కనిపిస్తుంది
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn Error: ${meData.message || 'టోకెన్ పర్మిషన్ సరిగ్గా లేదు (Scope Issue)'}`,
        debug: meData 
      });
    }

    const memberId = meData.id;

    // 2. పోస్ట్ చేయడం
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${memberId}`,
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

    const postData = await res.json();

    return res.status === 201 
      ? NextResponse.json({ success: true }) 
      : NextResponse.json({ success: false, error: "Post failed", details: postData });

  } catch (e: any) { 
    return NextResponse.json({ success: false, error: e.message }); 
  }
}