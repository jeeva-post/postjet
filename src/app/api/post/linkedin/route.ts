import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { content, mediaUrl } = body;
    const token = process.env.LINKEDIN_CLIENT_SECRET;

    if (!token) {
      return NextResponse.json({ success: false, error: "LinkedIn Token మిస్ అయ్యింది!" }, { status: 401 });
    }

    // 1. Member ID సంపాదించడం
    const meRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    
    let memberId = meData.sub || meData.id;

    if (!memberId) {
      // Fallback to /me
      const legacyRes = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const legacyData = await legacyRes.json();
      memberId = legacyData.id;
    }

    if (!memberId) {
      return NextResponse.json({ success: false, error: "LinkedIn ID కనుక్కోలేకపోయాము. పర్మిషన్లు చెక్ చేయండి." });
    }

    // 2. LinkedIn లో పోస్ట్ చేయడం (Handle Text & Media URL)
    // ఇమేజ్ నేరుగా రాదు కాబట్టి, దాన్ని ఒక లింక్ (ARTICLE) లాగా పంపుతున్నాము
    const shareMediaCategory = mediaUrl ? "ARTICLE" : "NONE";
    
    const postPayload = {
      author: `urn:li:person:${memberId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: shareMediaCategory,
          media: mediaUrl ? [{
            status: "READY",
            originalUrl: mediaUrl, // నేరుగా URL వాడాలంటే ARTICLE కేటగిరీ వాడాలి
            title: { text: "Shared via PostJet" }
          }] : undefined,
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    const postRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postPayload),
    });

    const responseData = await postRes.json().catch(() => ({}));

    if (postRes.status === 201 || postRes.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "LinkedIn API Error", 
        details: responseData 
      });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}