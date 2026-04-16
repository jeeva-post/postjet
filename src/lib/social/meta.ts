export async function postToMeta(platform: 'facebook' | 'instagram', content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  const version = "v19.0";
  try {
    const accountsRes = await fetch(`https://graph.facebook.com/${version}/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();
    const pageId = accountsData.data?.[0]?.id;
    if (!pageId) throw new Error("No FB Page linked.");

    if (platform === 'facebook') {
      const endpoint = isVideo ? `/${pageId}/videos` : `/${pageId}/photos`;
      const body = isVideo ? { description: content, file_url: mediaUrl } : { caption: content, url: mediaUrl };
      const res = await fetch(`https://graph.facebook.com/${version}${endpoint}?access_token=${accessToken}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      return await res.json();
    } else {
      const igRes = await fetch(`https://graph.facebook.com/${version}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`);
      const igData = await igRes.json();
      const igUserId = igData.instagram_business_account?.id;
      if (!igUserId) throw new Error("No IG Business account linked.");

      let containerUrl = `https://graph.facebook.com/${version}/${igUserId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
      containerUrl += isVideo ? `&media_type=REELS&video_url=${encodeURIComponent(mediaUrl)}` : `&image_url=${encodeURIComponent(mediaUrl)}`;
      
      const containerRes = await fetch(containerUrl, { method: "POST" });
      const containerData = await containerRes.json();
      if (containerData.error) throw new Error(containerData.error.message);

      // Async Publish for IG
      return { success: true, platform: "instagram", creationId: containerData.id, igUserId, accessToken };
    }
  } catch (err: any) { return { success: false, error: err.message }; }
}