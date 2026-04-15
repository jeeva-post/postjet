export async function postToTelegram(content: string, mediaUrl: string | null, isVideo: boolean) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    let method = mediaUrl ? (isVideo ? "sendVideo" : "sendPhoto") : "sendMessage";
    const body: any = { chat_id: chatId };

    if (mediaUrl) {
      if (isVideo) body.video = mediaUrl; else body.photo = mediaUrl;
      body.caption = content;
    } else {
      body.text = content;
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) { return { ok: false, error: err }; }
}