"use server";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "../../lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function postToAllPlatforms(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const content = formData.get("content") as string;
  const file = formData.get("media") as File;
  const selected = JSON.parse(formData.get("selectedPlatforms") as string);

  // 1. మీడియా అప్‌లోడ్ (Cloudinary)
  let mediaUrl = "";
  let isVideo = file && file.type.startsWith("video");
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    mediaUrl = await new Promise((res) => {
      cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "postjet" }, (err, result) => {
        res(result?.secure_url || "");
      }).end(buffer);
    });
  }

  // 2. డేటాబేస్ నుండి యూజర్ కనెక్ట్ చేసిన అన్ని అకౌంట్స్ తెచ్చుకోవడం
  const client = await clientPromise;
  const db = client.db("postjet");
  const accounts = await db.collection("accounts").find({ userId: user.id }).toArray();

  const tasks = [];

  // 3. ప్రతి ప్లాట్‌ఫామ్ కి విడివిడి లాజిక్
  for (const platform of selected) {
    const acc = accounts.find(a => a.platform === platform);
    if (!acc) continue; // అకౌంట్ లింక్ అవ్వకపోతే వదిలేయ్

    const token = acc.config.token || acc.config.pageAccessToken || acc.config.botToken;

    // --- 🔵 FACEBOOK ---
    if (platform === "Facebook") {
      const fbUrl = mediaUrl 
        ? `https://graph.facebook.com/v19.0/${acc.config.pageId}/photos?url=${encodeURIComponent(mediaUrl)}&message=${encodeURIComponent(content)}&access_token=${token}`
        : `https://graph.facebook.com/v19.0/${acc.config.pageId}/feed?message=${encodeURIComponent(content)}&access_token=${token}`;
      tasks.push(fetch(fbUrl, { method: "POST" }));
    }

    // --- 📸 INSTAGRAM ---
    if (platform === "Instagram" && mediaUrl) {
      tasks.push((async () => {
        const type = isVideo ? "VIDEO" : "IMAGE";
        const container = await fetch(`https://graph.facebook.com/v19.0/${acc.config.igId}/media?${isVideo ? 'video_url' : 'image_url'}=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content)}&access_token=${token}`, { method: "POST" });
        const cData = await container.json();
        if (cData.id) return fetch(`https://graph.facebook.com/v19.0/${acc.config.igId}/media_publish?creation_id=${cData.id}&access_token=${token}`, { method: "POST" });
      })());
    }

    // --- 🔵 LINKEDIN ---
    if (platform === "LinkedIn") {
      tasks.push(fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ author: `urn:li:person:${acc.config.personId}`, lifecycleState: "PUBLISHED", specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text: content }, shareMediaCategory: "NONE" } }, visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" } })
      }));
    }

    // --- ✈️ TELEGRAM ---
    if (platform === "Telegram") {
      const method = mediaUrl ? (isVideo ? "sendVideo" : "sendPhoto") : "sendMessage";
      const body: any = { chat_id: acc.config.chatId };
      mediaUrl ? (body[isVideo ? "video" : "photo"] = mediaUrl, body.caption = content) : body.text = content;
      tasks.push(fetch(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
    }

    // --- 🟢 WHATSAPP ---
    if (platform === "WhatsApp") {
      const waBody: any = { messaging_product: "whatsapp", to: acc.config.recipient, type: mediaUrl ? (isVideo ? "video" : "image") : "text" };
      mediaUrl ? (waBody[isVideo ? "video" : "image"] = { link: mediaUrl, caption: content }) : waBody.text = { body: content };
      tasks.push(fetch(`https://graph.facebook.com/v19.0/${acc.config.phoneId}/messages`, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(waBody) }));
    }

    // --- 🟠 REDDIT ---
    if (platform === "Reddit") {
      tasks.push(fetch('https://oauth.reddit.com/api/submit', { method: "POST", headers: { "Authorization": `Bearer ${token}` }, body: new URLSearchParams({ kind: "self", title: content.substring(0, 50), text: content, sr: acc.config.subreddit || "test" }) }));
    }

    // --- ⚫ X (TWITTER) ---
    if (platform === "X") {
      tasks.push(fetch('https://api.twitter.com/2/tweets', { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ text: content }) }));
    }

    // --- 🔴 YOUTUBE (Shorts/Video) ---
    if (platform === "YouTube" && mediaUrl && isVideo) {
      // YouTube requires a more complex upload, adding placeholder for integration
      console.log("YouTube Dispatch Initiated for:", mediaUrl);
    }

    // --- 📌 PINTEREST ---
    if (platform === "Pinterest" && mediaUrl) {
      tasks.push(fetch('https://api.pinterest.com/v5/pins', { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ board_id: acc.config.boardId, media_source: { source_type: "image_url", url: mediaUrl }, note: content }) }));
    }

    // --- 👻 SNAPCHAT & 🎵 TIKTOK ---
    if (platform === "Snapchat" || platform === "TikTok") {
      console.log(`${platform} API called for user ${user.id}`);
      // These usually work via direct Share API or Business SDK
    }
  }

  // 4. అన్ని పనులను ఒకేసారి పూర్తి చేయడం
  await Promise.allSettled(tasks);

  // 5. హిస్టరీ సేవ్ చేయడం
  await db.collection("posts").insertOne({
    userId: user.id,
    content,
    mediaUrl,
    platforms: selected,
    createdAt: new Date(),
  });

  return { success: true };
}