import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();
    console.log("🚀 PostJet Blast Sequence Started for Media:", mediaUrl ? "Media Found" : "Text Only");

    const results = [];
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    // --- 1. TELEGRAM LOGIC ---
    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      
      let method = "sendMessage";
      const body: any = { chat_id: chatId };

      if (mediaUrl) {
        if (isVideo) {
          method = "sendVideo";
          body.video = mediaUrl;
          body.caption = content;
        } else {
          method = "sendPhoto";
          body.photo = mediaUrl;
          body.caption = content;
        }
      } else {
        body.text = content;
      }

      const telRes = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const telData = await telRes.json();
      results.push({ platform: "telegram", success: telData.ok });
    }

    // --- 2. FACEBOOK LOGIC ---
    if (platforms.includes("facebook") && accessToken) {
      const pageId = process.env.FACEBOOK_PAGE_ID;
      const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
      const accountsData = await accountsRes.json();
      const targetPage = accountsData.data?.find((p: any) => p.id === pageId);

      if (targetPage) {
        const pageToken = targetPage.access_token;
        let fbEndpoint = `/${pageId}/feed`;
        const fbBody: any = { access_token: pageToken };

        if (mediaUrl) {
          if (isVideo) {
            fbEndpoint = `/${pageId}/videos`;
            fbBody.file_url = mediaUrl; // Facebook videos use file_url
            fbBody.description = content;
          } else {
            fbEndpoint = `/${pageId}/photos`;
            fbBody.url = mediaUrl;
            fbBody.caption = content;
          }
        } else {
          fbBody.message = content;
        }

        const fbRes = await fetch(`https://graph.facebook.com${fbEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fbBody),
        });
        const fbData = await fbRes.json();
        results.push({ platform: "facebook", success: !!fbData.id });
      }
    }

    // --- 3. INSTAGRAM LOGIC (Images/Videos) ---
    if (platforms.includes("instagram") && mediaUrl && accessToken) {
      const igId = process.env.INSTAGRAM_BUSINESS_ID;
      const mediaType = isVideo ? "VIDEO" : "IMAGE";
      
      // Step A: Container Creation
      const containerUrl = `https://graph.facebook.com/v19.0/${igId}/media`;
      const containerParams = new URLSearchParams({
        access_token: accessToken,
        caption: content,
        media_type: mediaType,
      });

      if (isVideo) {
        containerParams.append("video_url", mediaUrl);
      } else {
        containerParams.append("image_url", mediaUrl);
      }

      const containerRes = await fetch(`${containerUrl}?${containerParams.toString()}`, { method: "POST" });
      const containerData = await containerRes.json();

      if (containerData.id) {
        // Step B: Publish
        const publishUrl = `https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`;
        const publishRes = await fetch(publishUrl, { method: "POST" });
        const publishData = await publishRes.json();
        results.push({ platform: "instagram", success: !!publishData.id });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}