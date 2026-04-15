export async function postToFacebook(
  content: string, 
  mediaUrl: string | null, 
  isVideo: boolean, 
  accessToken: string
) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;

    // 1. యూజర్ టోకెన్ వాడి నీ పేజీల లిస్ట్ మరియు వాటి టోకెన్లు తెచ్చుకోవడం
    const accountsRes = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${accessToken}`
    );
    const accountsData = await accountsRes.json();

    if (accountsData.error) {
      throw new Error(`Facebook Auth Error: ${accountsData.error.message}`);
    }

    // నీ Vercel Settings లో ఉన్న Page ID కి సరిపోయే పేజీని వెతకడం
    const page = accountsData.data?.find((p: any) => p.id === pageId);
    
    if (!page) {
      throw new Error(`నీ Facebook అకౌంట్ లో ఈ Page ID (${pageId}) దొరకలేదు. పర్మిషన్స్ చెక్ చెయ్యి.`);
    }

    const pageAccessToken = page.access_token;

    // 2. మీడియా టైప్ (Photo/Video/Text) ని బట్టి ఎండ్ పాయింట్ సెట్ చేయడం
    let endpoint = `/${pageId}/feed`; // Default: Text post
    const body: any = { access_token: pageAccessToken };

    if (mediaUrl) {
      if (isVideo) {
        endpoint = `/${pageId}/videos`;
        body.file_url = mediaUrl;
        body.description = content;
      } else {
        endpoint = `/${pageId}/photos`;
        body.url = mediaUrl;
        body.caption = content;
      }
    } else {
      body.message = content;
    }

    // 3. ఫేస్‌బుక్ గ్రాఫ్ API కి రిక్వెస్ట్ పంపడం
    const res = await fetch(`https://graph.facebook.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.error) {
      throw new Error(`FB Posting Failed: ${result.error.message}`);
    }

    return { success: true, id: result.id, platform: "facebook" };

  } catch (err: any) {
    console.error("Facebook Engine Error:", err.message);
    // ఎర్రర్ ని స్ట్రింగ్ లాగా పంపిస్తున్నాం, అప్పుడు {} రాదు
    return { success: false, error: err.message || "Unknown Facebook Error", platform: "facebook" };
  }
}