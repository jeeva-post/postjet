export async function postToFacebook(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;

    // 1. యూజర్ టోకెన్ వాడి పేజీ టోకెన్ ని తెచ్చుకోవడం
    const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();

    if (accountsData.error) {
      throw new Error(`FB Auth Error: ${accountsData.error.message}`);
    }

    // మన Page ID కి సరిపోయే టోకెన్ ని వెతకడం
    const page = accountsData.data?.find((p: any) => p.id === pageId);
    
    if (!page) {
      throw new Error("నీ ఫేస్‌బుక్ అకౌంట్ లో ఈ Page ID దొరకలేదు. పర్మిషన్స్ చెక్ చెయ్యి.");
    }

    const pageAccessToken = page.access_token;

    // 2. ఫోటో నా, వీడియో నా లేక కేవలం టెక్స్ట్ నా అని చూడటం
    let endpoint = `/${pageId}/feed`; // Default text post
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

    // 3. అసలైన పోస్ట్ రిక్వెస్ట్
    const res = await fetch(`https://graph.facebook.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.error) {
      throw new Error(`Posting Failed: ${result.error.message}`);
    }

    return { success: true, id: result.id };

  } catch (err: any) {
    console.error("Facebook Repair Log:", err.message);
    return { success: false, error: err.message };
  }
}