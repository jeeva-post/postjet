"use server";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "../../lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
  const selectedPlatforms = JSON.parse(formData.get("selectedPlatforms") as string);

  // 1. Cloudinary Upload
  let mediaUrl = "";
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    mediaUrl = await new Promise((res, rej) => {
      cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "postjet" }, (err, result) => {
        if (err) rej(err); else res(result?.secure_url || "");
      }).end(buffer);
    });
  }

  // 2. Database నుండి యూజర్ అకౌంట్స్ తీసుకురావడం
  const client = await clientPromise;
  const db = client.db("postjet");
  const userAccounts = await db.collection("accounts").find({ userId: user.id }).toArray();

  const tasks = [];

  // 3. ప్రతి సెలెక్టెడ్ ప్లాట్‌ఫామ్ కి పోస్ట్ పంపడం
  for (const platform of selectedPlatforms) {
    const acc = userAccounts.find(a => a.platform === platform);
    if (!acc) continue; // ఆ అకౌంట్ కనెక్ట్ అయి లేకపోతే స్కిప్ చెయ్యి

    if (platform === "Telegram") {
      const { botToken, chatId } = acc.config;
      const method = mediaUrl ? (file.type.startsWith("video") ? "sendVideo" : "sendPhoto") : "sendMessage";
      const body: any = { chat_id: chatId };
      if (mediaUrl) {
        body[file.type.startsWith("video") ? "video" : "photo"] = mediaUrl;
        body["caption"] = content;
      } else { body["text"] = content; }

      tasks.push(fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }));
    }

    if (platform === "WhatsApp") {
      const { phoneId, token, recipient } = acc.config;
      const waBody: any = {
        messaging_product: "whatsapp",
        to: recipient,
        type: mediaUrl ? (file.type.startsWith("video") ? "video" : "image") : "text",
      };
      if (mediaUrl) {
        waBody[file.type.startsWith("video") ? "video" : "image"] = { link: mediaUrl, caption: content };
      } else { waBody["text"] = { body: content }; }

      tasks.push(fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(waBody)
      }));
    }
    // ఇలాగే FB, Instagram ని కూడా యాడ్ చేయవచ్చు
  }

  await Promise.allSettled(tasks);

  // 4. Save History
  await db.collection("posts").insertOne({
    userId: user.id,
    content,
    mediaUrl,
    platforms: selectedPlatforms,
    createdAt: new Date(),
  });

  return { success: true };
}