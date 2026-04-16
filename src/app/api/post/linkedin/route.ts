import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET;

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Vercel లో Token లేదు!" });
    }

    const token = accessToken.trim();

    // --- STEP 1: నీ ID ని కనుక్కోవడం (UserInfo API) ---
    // ఇది కొత్త అకౌంట్లకి పక్కాగా పనిచేసే పద్ధతి
    const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = await userinfoRes.json();
    
    // ఒకవేళ పైన రాకపోతే పాత పద్ధతిలో ట్రై చేస్తుంది
    let linkedinId = userInfo.sub; 
    if (!linkedinId) {
        const meRes = await fetch("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();
        linkedinId = meData.id;
    }

    if (!linkedinId) {
      return NextResponse.json({ success: false, error: "LinkedIn ID దొరకలేదు. Token పర్మిషన్స్ చెక్ చెయ్యి." });
    }

    // --- STEP 2: కొత్త API ద్వారా పోస్ట్ చేయడం ---
    // ఇది పాత 'ugcPosts' కంటే చాలా అడ్వాన్స్‌డ్
    const postUrl = "https://api.linkedin.com/rest/posts";

    const body: any = {
      author: `urn:li:person:${linkedinId}`,
      commentary: content || "Broadcast via PostJet",
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    };

    // ఒకవేళ ఇమేజ్ ఉంటే జత చేయడం
    if (mediaUrl) {
      body.content = {
        article: {
          source: mediaUrl,
          title: "PostJet Professional Feed",
          description: "Media shared via PostJet SaaS"
        }
      };
    }

    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401", // కొత్త వెర్షన్ హెడర్
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 201 || res.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await res.json();
      console.error("LinkedIn API Error:", errorData);
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${errorData.message || "Posting failed"}` 
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}