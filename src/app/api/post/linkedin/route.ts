import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.LINKEDIN_CLIENT_SECRET; // నీ Access Token

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Vercel లో Token లేదు!" });
    }

    // --- STEP 1: నీ మెంబర్ ID ని ఆటోమేటిక్ గా కనుక్కోవడం ---
    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken.trim()}` },
    });
    const meData = await meRes.json();
    
    if (!meData.id) {
      return NextResponse.json({ success: false, error: "LinkedIn ID ని పట్టుకోలేకపోయాము. టోకెన్ చెక్ చెయ్యి." });
    }

    // ఇక్కడ మార్పు చేశాను: 'person' బదులు 'member' వాడుతున్నాం
    const myMemberUrn = `urn:li:member:${meData.id}`;
    console.log("Using LinkedIn Member URN:", myMemberUrn);

    // --- STEP 2: పోస్ట్ చేయడం ---
    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: myMemberUrn, // ఇక్కడ మెంబర్ URN వాడుతున్నాం
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
      // లింక్డ్‌ఇన్ ఇచ్చే ఎర్రర్ ని క్లియర్ గా చూపిస్తున్నాను
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn: ${data.message || "Posting failed"}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}