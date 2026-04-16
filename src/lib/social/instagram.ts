export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();
    const pageId = accountsData.data?.[0]?.id;
    if (!pageId) throw new Error("FB Page not found.");

    const igRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`);
    const igData = await igRes.json();
    const igUserId = igData.instagram_business_account?.id;

    let containerUrl = `https://graph.facebook.com/v19.0/${igUserId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    containerUrl += isVideo ? `&media_type=REELS&video_url=${encodeURIComponent(mediaUrl)}` : `&image_url=${encodeURIComponent(mediaUrl)}`;

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(containerData.error.message);

    const creationId = containerData.id;

    // వీడియో అయితే ప్రాసెసింగ్ కోసం వెయిట్ చేయకుండా డేటాను పంపేస్తాం
    return { 
      success: true, 
      platform: "instagram", 
      id: creationId, 
      status: isVideo ? "processing" : "published", 
      igUserId, 
      accessToken 
    };
  } catch (err: any) {
    return { success: false, error: err.message, platform: "instagram" };
  }
}