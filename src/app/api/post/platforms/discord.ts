export async function postToDiscord(content: string, mediaUrl: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();

  if (!webhookUrl) throw new Error("Discord Webhook URL missing in .env");

  const body: any = { content: content };
  
  if (mediaUrl) {
    body.embeds = [{ image: { url: mediaUrl } }];
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("Discord Authentication or Webhook failed");
  return { success: true };
}