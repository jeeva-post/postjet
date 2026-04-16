export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    console.log("📸 IG Engine: Starting process...");

    // 1. Get the Instagram Business Account ID from the linked Facebook Page
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();
    
    const pageId = accountsData.data?.[0]?.id;
    if (!pageId) throw new Error("No Facebook Page found. Instagram Business requires a linked FB Page.");

    const igRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`);
    const igData = await igRes.json();
    const igUserId = igData.instagram_business_account?.id;

    if (!igUserId) throw new Error("Instagram Business Account not linked to this Facebook Page.");

    // 2. Create Media Container (Video or Image)
    let containerUrl = `https://graph.facebook.com/v19.0/${igUserId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    
    if (isVideo) {
      // Reels logic
      containerUrl += `&media_type=REELS&video_url=${encodeURIComponent(mediaUrl)}`;
    } else {
      // Image logic
      containerUrl += `&image_url=${encodeURIComponent(mediaUrl)}`;
    }

    console.log("⏳ IG Engine: Creating container...");
    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();
    
    if (containerData.error) throw new Error(`Container Error: ${containerData.error.message}`);

    const creationId = containerData.id;

    // 3. Wait & Publish (IG needs a few seconds for video processing)
    if (isVideo) {
      console.log("⏳ IG Engine: Waiting for video processing...");
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds wait for Reels
    }

    console.log("📤 IG Engine: Publishing...");
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: "POST" }
    );

    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(`Publish Error: ${publishData.error.message}`);

    return { success: true, platform: "instagram", id: publishData.id };
  } catch (err: any) {
    console.error("❌ IG Engine Error:", err.message);
    return { success: false, error: err.message, platform: "instagram" };
  }
}