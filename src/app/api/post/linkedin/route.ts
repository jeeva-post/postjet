import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    const memberId = process.env.LINKEDIN_CLIENT_ID; 
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!memberId || !accessToken) {
      return NextResponse.json({ success: false, error: "Vercel లో ID లేదా Token లేదు!" });
    }

    // ఇక్కడ మార్పు: 'person' బదులు 'member' వాడుతున్నాం
    const authorUrn = `urn:li:member:${memberId.trim()}`;
    
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";
    const body: any = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "PostJet Professional Post" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "Shared via PostJet" },
          media: mediaUrl,
          title: { text: "PostJet Media" },
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
        error: `LinkedIn: ${data.message || "Data Processing Error"}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}