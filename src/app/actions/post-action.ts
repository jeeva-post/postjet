"use server";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "../../lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Cloudinary Configuration
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

  let mediaUrl = "";
  let isVideo = file && file.type.startsWith("video");

  // 1. Cloudinary Upload Logic
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    mediaUrl = await new Promise((res, rej) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "postjet" },
        (err, result) => {
          if (err) rej(err);
          else res(result?.secure_url || "");
        }
      ).end(buffer);
    });
  }

  const tasks = [];

  // --- 🔵 FACEBOOK ---
  if (selected.includes("Facebook") && process.env.FACEBOOK_PAGE_ID) {
    tasks.push(async () => {
      const url = mediaUrl 
        ? `https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PAGE_ID}/photos?url=${encodeURIComponent(mediaUrl)}&message=${encodeURIComponent(content)}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`
        : `https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PAGE_ID}/feed?message=${encodeURIComponent(content)}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`;
      
      return fetch(url, { method: "POST" });
    });
  }

  // --- 📸 INSTAGRAM ---
  if (selected.includes("Instagram") && mediaUrl && process.env.INSTAGRAM_BUSINESS_ID) {
    tasks.push(async () => {
      const mediaParam = isVideo 
        ? `video_url=${encodeURIComponent(mediaUrl)}&media_type=VIDEO` 
        : `image_url=${encodeURIComponent(mediaUrl)}`;
      
      const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.INSTAGRAM_BUSINESS_ID}/media?${mediaParam}&caption=${encodeURIComponent(content)}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`, { method: "POST" });
      const data = await res.json();
      
      if (data.id) {
        return fetch(`https://graph.facebook.com/v19.0/${process.env.INSTAGRAM_BUSINESS_ID}/media_publish?creation_id=${data.id}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`, { method: "POST" });
      }
    });
  }

  // --- ✈️ TELEGRAM ---
  if (selected.includes("Telegram") && process.env.TELEGRAM_BOT_TOKEN) {
    tasks.push(async () => {
      const method = mediaUrl ? (isVideo ? "sendVideo" : "sendPhoto") : "sendMessage";
      const teleUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;
      const body: any = { chat_id: process.env.TELEGRAM_CHAT_ID };
      if (mediaUrl) {
        body[isVideo ? "video" : "photo"] = mediaUrl;
        body["caption"] = content;
      } else {
        body["text"] = content;
      }
      return fetch(teleUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });
  }

  // --- 🟢 WHATSAPP ---
  if (selected.includes("WhatsApp") && process.env.WHATSAPP_PHONE_ID) {
    tasks.push(async () => {
      const waUrl = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
      const waBody: any = {
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_RECIPIENT_ID,
        type: mediaUrl ? (isVideo ? "video" : "image") : "text",
      };
      if (mediaUrl) {
        waBody[isVideo ? "video" : "image"] = { link: mediaUrl, caption: content };
      } else {
        waBody["text"] = { body: content };
      }
      return fetch(waUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(waBody),
      });
    });
  }

  // 2. Execute All Tasks
  await Promise.allSettled(tasks.map(task => task()));

  // 3. Save to Database (History)
  const client = await clientPromise;
  await client.db("postjet").collection("posts").insertOne({
    userId: user.id,
    content,
    mediaUrl,
    platforms: selected,
    createdAt: new Date(),
  });

  return { success: true };
}