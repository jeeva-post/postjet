"use server";

import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function postToTelegram(formData: FormData): Promise<void> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    console.error("User not authenticated!");
    return;
  }

  const content = formData.get("content") as string;
  const file = formData.get("media") as File;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  try {
    const hasFile = file && file.size > 0;
    const isVideo = hasFile && file.type.startsWith("video/");
    const isImage = hasFile && file.type.startsWith("image/");

    let telegramResponse;

    // 1. టెలిగ్రామ్ కి పంపడం
    if (isVideo) {
      const vidData = new FormData();
      vidData.append("chat_id", chatId);
      vidData.append("caption", content || "");
      vidData.append("video", file);

      telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
        method: "POST",
        body: vidData,
      });
    } else if (isImage) {
      const imgData = new FormData();
      imgData.append("chat_id", chatId);
      imgData.append("caption", content || "");
      imgData.append("photo", file);

      telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: imgData,
      });
    } else if (content) {
      telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: content }),
      });
    }

    // 2. ఒకవేళ టెలిగ్రామ్ కి సక్సెస్ ఫుల్ గా వెళ్తే, MongoDB లో సేవ్ చేయడం
    if (telegramResponse && telegramResponse.ok) {
      const client = await clientPromise;
      const db = client.db("postjet");

      await db.collection("posts").insertOne({
        userId: user.id,
        content: content || "",
        mediaType: isVideo ? "video" : isImage ? "image" : "text",
        platform: "Telegram",
        status: "Success",
        createdAt: new Date(),
      });
      
      console.log("Post saved to MongoDB and sent to Telegram!");
    }

  } catch (error) {
    console.error("Critical Error:", error);
  }
}