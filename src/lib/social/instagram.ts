export async function postToInstagram(content: string, mediaUrl: string, isVideo: boolean, accessToken: string) {
  try {
    console.log("📸 IG Engine: Starting...");

    // 1. Get Instagram ID (Same as before)
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();
    const pageId = accountsData.data?.[0]?.id;
    if (!pageId) throw new Error("Facebook Page not found.");

    const igRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`);
    const igData = await igRes.json();
    const igUserId = igData.instagram_business_account?.id;
    if (!igUserId) throw new Error("Instagram Business Account not linked.");

    // 2. Create Media Container
    let containerUrl = `https://graph.facebook.com/v19.0/${igUserId}/media?caption=${encodeURIComponent(content)}&access_token=${accessToken}`;
    containerUrl += isVideo ? `&media_type=REELS&video_url=${encodeURIComponent(mediaUrl)}` : `&image_url=${encodeURIComponent(mediaUrl)}`;

    const containerRes = await fetch(containerUrl, { method: "POST" });
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(`Container Error: ${containerData.error.message}`);
    const creationId = containerData.id;

    // 3. Smart Polling (వీడియో రెడీ అయ్యే వరకు చెక్ చేయడం)
    if (isVideo) {
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 7; // గరిష్టంగా 7-8 సెకన్లు మాత్రమే చూస్తాం (Vercel limit కోసం)

      while (!isReady && attempts < maxAttempts) {
        console.log(`⏳ IG Engine: Checking status (Attempt ${attempts + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec wait
        
        const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const statusData = await statusRes.json();
        
        if (statusData.status_code === 'FINISHED') {
          isReady = true;
          console.log("✅ IG Engine: Media is ready!");
        } else if (statusData.status_code === 'ERROR') {
          throw new Error("Instagram processing failed.");
        }
        attempts++;
      }
    }

    // 4. Final Publish
    console.log("📤 IG Engine: Publishing now...");
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