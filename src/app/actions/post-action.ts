"use server";

import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// --- Cloudinary Config (నీ వెర్సెల్ పేర్ల ప్రకారం) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// --- HELPER 1: Cloudinary Upload ---
async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) reject(error);
      else resolve(result?.secure_url);
    }).end(buffer);
  });
}

// --- HELPER 2: Telegram (దీని పేరును 'postToTelegram' గా మార్చాను) ---
async function postToTelegram(content: string, file: File) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const fd = new FormData();
  fd.append("chat_id", chatId);
  fd.append("caption", content || "");
  
  if (file.type.startsWith("video/")) {
    fd.append("video", file);
    await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, { method: "POST", body: fd });
  } else {
    fd.append("photo", file);
    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: "POST", body: fd });
  }
}

// --- HELPER 3: Instagram ---
async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accId = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!token || !accId) return;

  const type = isVideo ? "VIDEO" : "IMAGE";
  const param = isVideo ? "video_url" : "image_url";
  
  const res = await fetch(`https://graph.facebook.com/v19.0/${accId}/media?${param}=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(content)}&media_type=${type}&access_token=${token}`, { method: "POST" });
  const data = await res.json();
  if (data.id) {
    await fetch(`https://graph.facebook.com/v19.0/${accId}/media_publish?creation_id=${data.id}&access_token=${token}`, { method: "POST" });
  }
}

// --- HELPER 4: YouTube ---
async function postToYouTube(content: string, file: File) {
  const token = process.env.YOUTUBE_ACCESS_TOKEN;
  if (!token || !file.type.startsWith("video/")) return;

  const meta = { snippet: { title: content.slice(0, 100), description: content }, status: { privacyStatus: "public" } };
  const fd = new FormData();
  fd.append("metadata", new Blob([JSON.stringify(meta)], { type: "application/json" }));
  fd.append("file", file);
  await fetch("https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });
}

// --- MAIN ACTION (ఇది ప్లాట్‌ఫామ్‌లను ట్రిగ్గర్ చేస్తుంది) ---
export async function postToAllPlatforms(formData: FormData): Promise<void> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return;

  const content = formData.get("content") as string;
  const file = formData.get("media") as File;
  const hasFile = file && file.size > 0;

  let mediaUrl = "";
  if (hasFile) {
    mediaUrl = (await uploadToCloudinary(file)) as string;
  }

  const tasks = [];
  if (hasFile) {
    // 1. Telegram
    tasks.push(postToTelegram(content, file));

    // 2. Instagram
    if (process.env.INSTAGRAM_ACCESS_TOKEN && mediaUrl) {
      tasks.push(postToInstagram(content, mediaUrl, file.type.startsWith("video/")));
    }

    // 3. YouTube (వీడియో అయితేనే)
    if (file.type.startsWith("video/") && process.env.YOUTUBE_ACCESS_TOKEN) {
      tasks.push(postToYouTube(content, file));
    }
  }

  await Promise.allSettled(tasks);

  // MongoDB లో హిస్టరీ సేవ్ చేయడం
  const client = await clientPromise;
  await client.db("postjet").collection("posts").insertOne({
    userId: user.id,
    content,
    mediaUrl,
    createdAt: new Date(),
  });
}