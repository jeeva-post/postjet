"use server";

export async function postToTelegram(formData: FormData) {
  const message = formData.get("message") as string;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!message || message.trim() === "") {
    return { error: "మెసేజ్ ఖాళీగా ఉండకూడదు!" };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true };
    } else {
      return { error: "మెసేజ్ పంపడంలో సమస్య వచ్చింది!" };
    }
  } catch (error) {
    console.error("Server Error:", error);
    return { error: "సర్వర్ ఎర్రర్: మళ్ళీ ప్రయత్నించండి." };
  }
}