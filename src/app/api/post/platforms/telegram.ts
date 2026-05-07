export async function postToTelegram(content: string, mediaUrl: string, mediaType: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const method = mediaType === 'video' ? 'sendVideo' : (mediaUrl ? 'sendPhoto' : 'sendMessage');

  const body: any = { chat_id: chatId };
  if (mediaUrl) {
    body[mediaType === 'video' ? 'video' : 'photo'] = mediaUrl;
    body.caption = content;
  } else {
    body.text = content;
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}