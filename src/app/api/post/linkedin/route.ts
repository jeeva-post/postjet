import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // Vercel Environment Variables
    const linkedinId = process.env.LINKEDIN_PERSON_ID; // నీ ప్రొఫైల్ ID (urn:li:person:XXXX)
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

    if (!linkedinId || !accessToken) {
      return NextResponse.json({ 
        success: false, 
        error: "Vercel సెట్టింగ్స్‌లో LinkedIn ID లేదా Token లేదు!" 
      });
    }

    // LinkedIn API ద్వారా పోస్ట్ చేయడం
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: `urn:li:person:${linkedinId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    // ఒకవేళ ఇమేజ్ ఉంటే దాన్ని జత చేయడం
    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "PostJet Professional Post" },
          media: mediaUrl,
          title: { text: "Shared via PostJet" },
        },
      ];
    }

    const res = await fetch(linkedinUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status !== 201) {
      return NextResponse.json({ 
        success: false, 
        error: data.message || "LinkedIn Auth Error" 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "LinkedIn Server Error" });
  }
}