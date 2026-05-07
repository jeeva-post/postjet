export async function postToInstagram(content: string, mediaUrl: string, mediaType: string) {
  const igId = process.env.INSTAGRAM_BUSINESS_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  // Step 1: Container
  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: token,
      [mediaType === 'video' ? 'video_url' : 'image_url']: mediaUrl,
      caption: content,
      media_type: mediaType === 'video' ? 'VIDEO' : 'IMAGE'
    })
  });
  const containerData = await containerRes.json();
  if (!containerRes.ok) throw new Error(containerData.error?.message || "IG Container Failed");

  // Step 2: Publish
  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: token, creation_id: containerData.id })
  });
  return await publishRes.json();
}