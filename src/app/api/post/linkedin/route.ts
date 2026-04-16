import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Vercel లో Token లేదు!" });
    }

    const token = accessToken.trim();

    // --- STEP 1: నీ అసలు 'Numeric' ID ని కనుక్కోవడం ---
    // మనం రెండు రకాలుగా ట్రై చేద్దాం
    let linkedinId = "";
    
    // పద్ధతి A: కొత్త OpenID పద్ధతి
    const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = await userinfoRes.json();
    
    if (userInfo.sub) {
        linkedinId = userInfo.sub; // ఇది అంకెల్లో ఉండే అవకాశం ఉంది
    } else {
        // పద్ధతి B: పాత v2/me పద్ధతి
        const meRes = await fetch("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();
        linkedinId = meData.id;
    }

    if (!linkedinId) {
      return NextResponse.json({ success: false, error: "LinkedIn ID ని కనుక్కోలేకపోయాము. పర్మిషన్స్ చెక్ చెయ్యి." });
    }

    // --- STEP 2: పోస్ట్ చేయడం ---
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";
    
    // ఒకవేళ ఐడీలో అక్షరాలు ఉంటే 'person', కేవలం అంకెలు ఉంటే 'member' గా ట్రై చేద్దాం
    const isNumeric = /^\d+$/.test(linkedinId);
    const authorUrn = isNumeric ? `urn:li:member:${linkedinId}` : `urn:li:person:${linkedinId}`;

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
          description: { text: "Professional Content" },
          media: mediaUrl,
          title: { text: "PostJet Broadcast" },
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
        error: `LinkedIn: ${data.message || "Data Processing Error"}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}