export async function postToSlack(content: string, mediaUrl: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error("Slack Webhook URL missing in .env");
  }

  // Slack block structure for better look
  const blocks: any[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: content,
      },
    },
  ];

  // Image unte add chestundi
  if (mediaUrl) {
    blocks.push({
      type: "image",
      image_url: mediaUrl,
      alt_text: "PostJet Image",
    });
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Slack Error:", errorText);
    throw new Error("Slack post failed");
  }

  return { success: true };
}