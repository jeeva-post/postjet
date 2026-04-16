import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Token missing in Vercel!" });
    }

    const token = accessToken.trim();

    // 1. నీ ఐడీని పక్కాగా కనుక్కోవడం (Versionless call)
    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    
    if (!meData.id) {
      return NextResponse.json({ success: false, error: "లింక్డ్‌ఇన్ నుండి మీ ఐడీ దొరకలేదు. టోకెన్ పర్మిషన్ సరిగ్గా లేదు." });
    }

    const personUrn = `urn:li:person:${meData.id}`;

    // 2. పాత స్థిరమైన V2 API ని వాడటం
    const ugcUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "PostJet Broadcast" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    // ఇమేజ్ ఉన్నప్పుడు మాత్రమే మీడియా జత చేయడం
    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "Shared via PostJet" },
          media: mediaUrl,
          title: { text: "Media Content" },
        },
      ];
    }

    const res = await fetch(ugcUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status === 201 || res.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      // లింక్డ్‌ఇన్ ఇచ్చే అసలు ఎర్రర్ ని ఇక్కడ పట్టుకుందాం
      console.error("LinkedIn Detailed Error:", data);
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${data.message || "Posting failed"}` 
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}