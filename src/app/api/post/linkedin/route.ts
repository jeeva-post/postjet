import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // వెర్సెల్ లో నువ్వు ఇచ్చిన ఐడీ మరియు టోకెన్
    const personId = process.env.LINKEDIN_CLIENT_ID; 
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!personId || !accessToken) {
      return NextResponse.json({ 
        success: false, 
        error: "Vercel లో LINKEDIN_CLIENT_ID లేదా SECRET(Token) దొరకలేదు!" 
      });
    }

    // పోయినసారి ఎర్రర్ ప్రకారం 'person' బదులు 'member' వాడుతున్నాం
    const myMemberUrn = `urn:li:member:${personId.trim()}`;
    
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: myMemberUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "Shared via PostJet" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "PostJet Professional Content" },
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
      // లింక్డ్‌ఇన్ ఇచ్చే అసలు ఎర్రర్ ని ఇక్కడ పట్టుకుంటున్నాం
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${data.message || "Invalid Token or Scope"}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}