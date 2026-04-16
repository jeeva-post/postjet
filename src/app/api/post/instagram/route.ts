import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, mediaUrl } = await req.json();
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = process.env.FB_PAGE_ID;

    // 1. Vercel keys check
    if (!accessToken || !pageId) {
      return NextResponse.json({ 
        success: false, 
        error: "Vercel settings lo FB_ACCESS_TOKEN leda FB_PAGE_ID ledu." 
      });
    }

    if (!mediaUrl) {
      return NextResponse.json({ 
        success: false, 
        error: "Instagram post ki Image URL thappanisari." 
      });
    }

    // --- STEP 1: FB Page nundi Instagram ID ni auto-detect cheyadam ---
    console.log("Fetching Instagram ID for Page:", pageId);
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );
    const igAccountData = await igAccountRes.json();

    if (!igAccountData.instagram_business_account) {
      console.error("IG Account Error:", igAccountData);
      return NextResponse.json({ 
        success: false, 
        error: "Eee FB Page ki Instagram Business account link ayi ledu. Meta settings chudu." 
      });
    }

    const instagramBusinessId = igAccountData.instagram_business_account.id;
    console.log("Found Instagram Business ID:", instagramBusinessId);

    // --- STEP 2: Media Container Create cheyadam ---
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content || "")}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const containerData = await containerRes.json();

    if (!containerData.id) {
      console.error("Container Error:", containerData);
      return NextResponse.json({ 
        success: false, 
        error: `Media Error: ${containerData.error?.message || "Container creation failed"}` 
      });
    }

    const creationId = containerData.id;

    // --- STEP 3: Media Publish cheyadam ---
    // Konni sarlu upload avvadaniki 2-3 seconds padutundi, anduke wait chestham
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );
    const publishData = await publishRes.json();

    if (publishData.id) {
      return NextResponse.json({ success: true, id: publishData.id });
    } else {
      console.error("Publish Error:", publishData);
      return NextResponse.json({ 
        success: false, 
        error: `Publish Error: ${publishData.error?.message}` 
      });
    }

  } catch (err: any) {
    console.error("Server Crash:", err);
    return NextResponse.json({ success: false, error: "Server Error: " + err.message });
  }
}