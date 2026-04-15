import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken, mediaUrl } = await req.json();
    const results = [];
    
    // వీడియోనా కాదా అని చెక్ చేసే చిన్న లాజిక్
    const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    console.log("🚀 PostJet Blast sequence started for:", platforms);

    // --- 1. TELEGRAM ---
    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      
      let method = "sendMessage";
      const body: any = { chat_id: chatId };

      if (mediaUrl) {
        method = isVideo ? "sendVideo" : "sendPhoto";
        if (isVideo) body.video = mediaUrl; else body.photo = mediaUrl;
        body.caption = content;
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

    // --- 2. FACEBOOK ---
    if (platforms.includes("facebook") && accessToken) {
      const pageId = process.env.FACEBOOK_PAGE_ID;
      const accRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
      const accData = await accRes.json();
      const page = accData.data?.find((p: any) => p.id === pageId);

      if (page) {
        const pageToken = page.access_token;
        let endpoint = `/${pageId}/feed`;
        const fbBody: any = { access_token: pageToken };

        if (mediaUrl) {
          if (isVideo) {
            endpoint = `/${pageId}/videos`;
            fbBody.file_url = mediaUrl;
            fbBody.description = content;
          } else {
            endpoint = `/${pageId}/photos`;
            fbBody.url = mediaUrl;
            fbBody.caption = content;
          }
        } else {
          fbBody.message = content;
        }

        const fbRes = await fetch(`https://graph.facebook.com${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fbBody),
        });
        const fbData = await fbRes.json();
        results.push({ platform: "facebook", success: !!fbData.id });
      }
    }

    // --- 3. INSTAGRAM ---
    if (platforms.includes("instagram") && mediaUrl && accessToken) {
      const igId = process.env.INSTAGRAM_BUSINESS_ID;
      const containerUrl = `https://graph.facebook.com/v19.0/${igId}/media`;
      const params = new URLSearchParams({
        access_token: accessToken,
        caption: content,
        media_type: isVideo ? "VIDEO" : "IMAGE",
        [isVideo ? "video_url" : "image_url"]: mediaUrl
      });

      const cRes = await fetch(`${containerUrl}?${params.toString()}`, { method: "POST" });
      const cData = await cRes.json();

      if (cData.id) {
        const pRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish?creation_id=${cData.id}&access_token=${accessToken}`, { method: "POST" });
        const pData = await pRes.json();
        results.push({ platform: "instagram", success: !!pData.id });
      }
    }

    // --- 4. YOUTUBE ---
    if (platforms.includes("youtube") && mediaUrl && isVideo && accessToken) {
      const ytUrl = `https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status`;
      const ytRes = await fetch(ytUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          snippet: { title: content.substring(0, 100), description: content, categoryId: "22" },
          status: { privacyStatus: "public" }
        })
      });
      const ytData = await ytRes.json();
      results.push({ platform: "youtube", success: !!ytData.id });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}