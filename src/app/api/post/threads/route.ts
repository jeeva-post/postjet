import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN; // Threads కూడా మెటా టోకెన్ వాడుతుంది
    const threadsUserId = process.env.THREADS_USER_ID; 

    if (!accessToken || !threadsUserId) {
      return NextResponse.json({ success: false, error: "Threads Configuration Missing" });
    }

    // STEP 1: Create Threads Container
    let containerUrl = `https://graph.threads.net/v1.0/${threadsUserId}/threads?text=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    if (mediaUrl) {
      // ఒకవేళ మీడియా ఉంటే అది ఇమేజ్ కింద తీసుకుంటుంది
      containerUrl += `&media_type=IMAGE&image_url=${encodeURIComponent(mediaUrl)}`;
    } else {
      containerUrl += `&media_type=TEXT`;
    }

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();

    if (!containerData.id) {
      return NextResponse.json({ success: false, error: "Threads Container Failed", debug: containerData });
    }

    // STEP 2: Publish Thread
    const publishRes = await fetch(
      `https://graph.threads.net/v1.0/${threadsUserId}/threads_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    return publishData.id 
      ? NextResponse.json({ success: true, message: "Threads Post Success! 🧵" })
      : NextResponse.json({ success: false, error: "Threads Publish Failed" });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}