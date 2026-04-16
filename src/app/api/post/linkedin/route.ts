import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    
    // వెర్సెల్ నుండి నీ వేరియబుల్స్ తీసుకుంటున్నాం
    const pId = process.env.LINKEDIN_CLIENT_ID; 
    const secret = process.env.LINKEDIN_CLIENT_SECRET;

    // ఇక్కడ ఏ కీ మిస్ అయిందో మనకు అర్థమైపోతుంది
    if (!pId) {
        return NextResponse.json({ success: false, error: "Vercel లో LINKEDIN_CLIENT_ID దొరకలేదు!" });
    }
    if (!secret) {
        return NextResponse.json({ success: false, error: "Vercel లో LINKEDIN_CLIENT_SECRET దొరకలేదు!" });
    }

    const linkedinUrl = "https://api.linkedin.com/v2/ugcPosts";

    const body: any = {
      author: `urn:li:person:${pId.trim()}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content || "" },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    if (mediaUrl) {
      body.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: { text: "PostJet Post" },
          media: mediaUrl,
          title: { text: "Image Shared via PostJet" },
        },
      ];
    }

    const res = await fetch(linkedinUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret.trim()}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status !== 201) {
      return NextResponse.json({ 
        success: false, 
        error: `LinkedIn Error: ${data.message || "Invalid Access Token"}` 
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Server Error occurred" });
  }
}