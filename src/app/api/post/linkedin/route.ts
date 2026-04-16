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
    const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = await userinfoRes.json();
    
    let linkedinId = userInfo.sub; 

    if (!linkedinId) {
      return NextResponse.json({ success: false, error: "LinkedIn ID ని పట్టుకోలేకపోయాము. టోకెన్ పర్మిషన్స్ చెక్ చెయ్యి." });
    }

    // --- STEP 2: కొత్త API ద్వారా పోస్ట్ చేయడం ---
    const postUrl = "https://api.linkedin.com/rest/posts";

    const body: any = {
      author: `urn:li:person:${linkedinId}`,
      commentary: content || "PostJet Professional Broadcast",
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    };

    // ఇమేజ్ ఉన్నా లేకపోయినా క్రాష్ అవ్వకుండా సెట్ చేస్తున్నాను
    if (mediaUrl) {
      body.content = {
        article: {
          source: mediaUrl,
          title: "Shared via PostJet Pro",
          description: "Professional content delivery"
        }
      };
    }

    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202402", // ఇక్కడ వెర్షన్ మార్చాను
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 201 || res.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await res.json();
      console.error("LinkedIn API Error:", errorData);
      
      // ఒకవేళ మళ్ళీ వెర్షన్ ఎర్రర్ వస్తే అది ఇక్కడ కనిపిస్తుంది
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${errorData.message || "Version or Auth Error"}` 
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}