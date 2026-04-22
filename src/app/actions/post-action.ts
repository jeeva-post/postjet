"use server";

export async function postToTelegram(formData: FormData): Promise<void> {
  const content = formData.get("content") as string;
  if (!content) return;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram credentials missing!");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: content,
      }),
    });
    console.log("Post sent successfully to Telegram!");
  } catch (error) {
    console.error("Error posting to Telegram:", error);
  }
}