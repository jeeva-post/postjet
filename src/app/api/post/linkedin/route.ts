import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // నువ్వు అడిగిన పేర్లతోనే ఇక్కడ వేరియబుల్స్ తీసుకుంటున్నాను
    // వెర్సెల్ లో నువ్వు ఇచ్చిన LINKEDIN_CLIENT_ID ని ఇక్కడ ID గా, 
    // LINKEDIN_CLIENT_SECRET ని Access Token గా వాడుతున్నాం.
    const personId = process.env.LINKEDIN_CLIENT_ID; 
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!personId || !accessToken) {
      return NextResponse.json({ 
        success: false, 
        error: "Vercel సెట్టింగ్స్‌లో Client ID లేదా Secret (Token) కనిపించట్లేదు!" 
      });
    }

    // LinkedIn API ద్వారా పోస్ట్ చేసే లాజిక్
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: `urn:li:person:${personId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    // ఒకవేళ ఇమేజ్ ఉంటే జత చేయడం
    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "PostJet Professional Broadcast" },
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

    // లింక్డ్‌ఇన్ నుండి వచ్చే రెస్పాన్స్ ని చెక్ చేయడం
    if (res.status !== 201) {
      return NextResponse.json({ 
        success: false, 
        error: data.message || "LinkedIn Auth Error: మీ టోకెన్ లేదా ఐడి చెక్ చేసుకోండి." 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "LinkedIn Server Error occurred." });
  }
}