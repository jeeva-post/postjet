import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET; // నీ Access Token

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Vercel లో Token లేదు!" });
    }

    // --- STEP 1: నీ అసలు LinkedIn ID ని ఆటోమేటిక్ గా కనుక్కోవడం ---
    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken.trim()}` },
    });
    const meData = await meRes.json();
    
    if (!meData.id) {
      return NextResponse.json({ success: false, error: "LinkedIn ID ని పట్టుకోలేకపోయాము. టోకెన్ చెక్ చెయ్యి." });
    }

    const myPersonUrn = `urn:li:person:${meData.id}`;
    console.log("Found LinkedIn ID:", myPersonUrn);

    // --- STEP 2: పోస్ట్ చేయడం ---
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: myPersonUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "PostJet Professional Broadcast" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "Professional Post" },
          media: mediaUrl,
          title: { text: "Shared via PostJet" },
        },
      ];
    }

    const res = await fetch(linkedinUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.trim()}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status !== 201) {
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${data.message || "Posting failed"}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}