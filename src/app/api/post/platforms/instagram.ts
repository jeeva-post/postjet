export async function postToInstagram(content: string, mediaUrl: string, mediaType: string, fbPageId: string, accessToken: string) {
  if (!accessToken) throw new Error("Missing Access Token");
  if (!fbPageId) throw new Error("Missing Facebook Page ID");
  if (!mediaUrl) throw new Error("Instagram requires mediaUrl");

  const pageInfoRes = await fetch(`https://graph.facebook.com/v19.0/${fbPageId}?fields=instagram_business_account&access_token=${accessToken}`);
  const pageInfo = await pageInfoRes.json();
  console.log('Instagram page info response:', pageInfo);
  if (!pageInfoRes.ok) {
    throw new Error(pageInfo.error?.message || 'Failed to resolve Instagram business account');
  }

  const igUserId = pageInfo.instagram_business_account?.id;
  if (!igUserId) {
    throw new Error('Instagram Business Account ID missing for this Facebook page');
  }

  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      [mediaType === 'video' ? 'video_url' : 'image_url']: mediaUrl,
      caption: content,
      media_type: mediaType === 'video' ? 'VIDEO' : 'IMAGE'
    })
  });

  const containerData = await containerRes.json();
  console.log('Instagram container response:', containerData);
  if (!containerRes.ok) {
    throw new Error(containerData.error?.message || `Instagram container failed: ${JSON.stringify(containerData)}`);
  }

  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken, creation_id: containerData.id })
  });

  const publishData = await publishRes.json();
  console.log('Instagram publish response:', publishData);
  if (!publishRes.ok) {
    throw new Error(publishData.error?.message || `Instagram publish failed: ${JSON.stringify(publishData)}`);
  }

  return { success: true, data: publishData };
}