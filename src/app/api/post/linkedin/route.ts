import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // వెర్సెల్ నుండి వివరాలు
    const personIdFromVercel = process.env.LINKEDIN_CLIENT_ID; 
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Token లేదు!" });
    }

    const token = accessToken.trim();
    let finalId = personIdFromVercel?.trim();

    // ఒకవేళ వెర్సెల్ లో ఐడీ లేకపోతే, అప్పుడు మాత్రమే వెతకాలి
    if (!finalId) {
        const meRes = await fetch("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();
        finalId = meData.id;
    }

    if (!finalId) {
      return NextResponse.json({ success: false, error: "LinkedIn ID దొరకట్లేదు. Vercel లో మ్యాన్యువల్ గా నెంబర్ ఐడీ ఇవ్వండి." });
    }

    // లింక్డ్‌ఇన్ కి పంపాల్సిన అసలు URN
    const authorUrn = `urn:li:person:${finalId}`;

    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";
    const body: any = {
      author: authorUrn,
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
          description: { text: "PostJet Professional" },
          media: mediaUrl,
          title: { text: "Broadcast via PostJet" },
        },
      ];
    }

    const res = await fetch(linkedinUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status !== 201) {
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${data.message || "Posting failed. Check ID/Token."}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}