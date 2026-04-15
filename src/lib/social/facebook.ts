export async function postToFacebook(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();
    
    if (accountsData.error) throw new Error(`FB Auth Error: ${accountsData.error.message}`);
    const page = accountsData.data?.find((p: any) => p.id === pageId);
    if (!page) throw new Error(`Page ID (${pageId}) match failed.`);

    const pageAccessToken = page.access_token;
    let endpoint = `/${pageId}/feed`;
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

    const res = await fetch(`https://graph.facebook.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const result = await res.json();
    if (result.error) throw new Error(result.error.message);
    return { success: true, id: result.id, platform: "facebook" };
  } catch (err: any) { 
    return { success: false, error: err.message, platform: "facebook" }; 
  }
}