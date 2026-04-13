"use server";

export async function postToTelegram(formData: FormData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // FormData నుండి డేటాను తీసుకోవడం
  const message = formData.get("text") as string || "";
  const imageUrl = formData.get("media") as string || ""; // ఒకవేళ URL పంపిస్తే

  if (!token || !chatId) {
    console.error("Telegram credentials missing!");
    return { success: false, error: "Credentials missing" };
  }

  try {
    let url = "";
    if (imageUrl && imageUrl.startsWith("http")) {
      // ఇమేజ్ ఉంటే sendPhoto
      url = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(message)}`;
    } else {
      // కేవలం టెక్స్ట్ అయితే sendMessage
      url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    
    if (data.ok) {
      return { success: true, error: null };
    } else {
      console.error("Telegram API Error:", data.description);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error("Telegram Error:", error);
    return { success: false, error: "Network error" };
  }
}

// పాత పేరు కోసం Alias
export const sendTelegramMessage = postToTelegram;