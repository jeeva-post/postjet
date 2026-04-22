"use server";

import clientPromise from "@/lib/mongodb";

export async function postToTelegram(formData: FormData) {
  const content = formData.get("content") as string;

  if (!content) return { error: "Content is empty!" };

  // 1. నీ Environment Variables నుండి టోకెన్స్ తీసుకోవాలి
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { error: "Telegram settings missing in Vercel!" };
  }

  try {
    // 2. Telegram API కి రిక్వెస్ట్ పంపడం
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: content,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { error: "Failed to post to Telegram" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
}