export async function postToDevTo(content: string, mediaUrl: string) {
  const apiKey = process.env.DEVTO_API_KEY?.trim();

  if (!apiKey) throw new Error("Dev.to API Key missing in .env");

  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      article: {
        title: content.substring(0, 50) + "...", // Content lo modati 50 letters title ga
        body_markdown: `${content}\n\n![Image](${mediaUrl})`,
        published: true
      }
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Dev.to post failed");
  return data;
}