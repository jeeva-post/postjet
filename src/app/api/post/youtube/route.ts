import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, tags } = body;
    const videoUrl = body.videoUrl || body.mediaUrl;

    if (!videoUrl) {
      return NextResponse.json({ success: false, error: "Video URL మిస్ అయ్యింది!" });
    }

    // 1. Access Token సంపాదించడం
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: "Google API Error", 
        details: tokenData 
      });
    }

    const accessToken = tokenData.access_token;

    // 2. YouTube Upload ప్రారంభం
    const metadataRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Type": "video/*",
        },
        body: JSON.stringify({
          snippet: {
            title: title || "New Video from PostJet",
            description: description || "Uploaded via PostJet",
            tags: tags || [],
            categoryId: "22",
          },
          status: { privacyStatus: "public" },
        }),
      }
    );

    const uploadUrl = metadataRes.headers.get("Location");
    if (!uploadUrl) {
      return NextResponse.json({ success: false, error: "YouTube Upload URL రాలేదు." });
    }

    // 3. వీడియోను పంపడం
    const videoFileRes = await fetch(videoUrl);
    const videoBlob = await videoFileRes.blob();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "video/*" },
      body: videoBlob,
    });

    if (uploadRes.ok) {
      return NextResponse.json({ success: true, message: "YouTube Success! 🎉" });
    } else {
      return NextResponse.json({ success: false, error: "YouTube Upload Failed" });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}