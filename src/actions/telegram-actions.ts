"use server";

// ఇక్కడ (data: any, secondArg?: string) అని మార్చాను 
// దీనివల్ల ఫ్రంటెండ్ లో 1 లేదా 2 ఆర్గుమెంట్లు పంపినా బిల్డ్ ఫెయిల్ అవ్వదు.
export async function postToTelegram(data: any, secondArg?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let message = "";
  let imageUrl = "";

  // ఒకవేళ FormData పంపిస్తే
  if (data instanceof FormData) {
    message = data.get("text") as string || "";
    imageUrl = data.get("media") as string || "";
  } else {
    // ఒకవేళ పాత పద్ధతిలో (message, url) పంపిస్తే
    message = data || "";
    imageUrl = secondArg || "";
  }

  if (!token || !chatId) return { success: false, error: "Credentials missing" };

  try {
    let url = "";
    if (imageUrl && imageUrl.startsWith("http")) {
      url = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(message)}`;
    } else {
      url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    }

    const res = await fetch(url);
    const resData = await res.json();
    return resData.ok ? { success: true, error: null } : { success: false, error: resData.description };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export const sendTelegramMessage = postToTelegram;