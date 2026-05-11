export async function postToFacebook(content: string, mediaUrl: string, mediaType: string, fbPageId: string, fbToken: string) {
  if (!fbToken) throw new Error("Missing Access Token");
  if (!fbPageId) throw new Error("Missing Facebook Page ID");

  let endpoint = "";
  const bodyData: any = { access_token: fbToken };

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
  console.log('Facebook API Request:', { endpoint, bodyData });
  console.log('Facebook API Response:', data);

  if (!res.ok) {
    throw new Error(data.error?.message || `Facebook API Error: ${JSON.stringify(data)}`);
  }

  return { success: true, data };
}