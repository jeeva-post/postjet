export async function postToFacebook(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    
    // 1. పేజీ టోకెన్ కోసం రిక్వెస్ట్
    const accRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const accData = await accRes.json();
    
    if (accData.error) {
      throw new Error(`Facebook Auth Error: ${accData.error.message}`);
    }

    const page = accData.data?.find((p: any) => p.id === pageId);
    if (!page) {
      throw new Error(`Page ID (${pageId}) match failed. Check if your Facebook account is an Admin of this page.`);
    }

    const pageAccessToken = page.access_token;

    // 2. మీడియా టైప్ ని బట్టి ఎండ్ పాయింట్ సెలెక్ట్ చేయడం
    let endpoint = `/${pageId}/feed`;
    const fbBody: any = { access_token: pageAccessToken };
    
    if (mediaUrl) {
      if (isVideo) {
        endpoint = `/${pageId}/videos`;
        fbBody.file_url = mediaUrl;
        fbBody.description = content;
      } else {
        endpoint = `/${pageId}/photos`;
        fbBody.url = mediaUrl;
        fbBody.caption = content;
      }
    } else {
      fbBody.message = content;
    }

    // 3. అసలైన పోస్ట్ రిక్వెస్ట్
    const res = await fetch(`https://graph.facebook.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fbBody),
    });
    
    const result = await res.json();
    if (result.error) throw new Error(`FB Post Error: ${result.error.message}`);

    return { success: true, id: result.id, platform: "facebook" };

  } catch (err: any) { 
    // ఇక్కడ ఎర్రర్ ని స్ట్రింగ్ లాగా పంపిస్తున్నాం, అప్పుడు {} రాదు
    return { success: false, error: err.message || "Unknown Facebook Error", platform: "facebook" }; 
  }
}