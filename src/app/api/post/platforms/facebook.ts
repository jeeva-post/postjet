export async function postToFacebook(content: string, mediaUrl: string, mediaType: string) {
  const fbPageId = process.env.FACEBOOK_PAGE_ID;
  const fbToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  let endpoint = "";
  let bodyData: any = { access_token: fbToken };

  if (mediaUrl) {
    endpoint = `https://graph.facebook.com/v19.0/${fbPageId}/${mediaType === 'video' ? 'videos' : 'photos'}`;
    bodyData[mediaType === 'video' ? 'file_url' : 'url'] = mediaUrl;
    bodyData[mediaType === 'video' ? 'description' : 'caption'] = content;
  } else {
    endpoint = `https://graph.facebook.com/v19.0/${fbPageId}/feed`;
    bodyData.message = content;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Facebook API Error");
  return data;
}