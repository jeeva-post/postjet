export async function postToFacebook(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const accountsData = await accountsRes.json();
    if (accountsData.error) throw new Error(`FB Auth Error: ${accountsData.error.message}`);

    const page = accountsData.data?.find((p: any) => p.id === pageId);
    if (!page) throw new Error("FB Page matching failed.");

    const pageAccessToken = page.access_token;
    let endpoint = mediaUrl ? (isVideo ? `/${pageId}/videos` : `/${pageId}/photos`) : `/${pageId}/feed`;
    const fbBody: any = { access_token: pageAccessToken };
    
    if (mediaUrl) {
      if (isVideo) { fbBody.file_url = mediaUrl; fbBody.description = content; }
      else { fbBody.url = mediaUrl; fbBody.caption = content; }
    } else fbBody.message = content;

    const res = await fetch(`https://graph.facebook.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fbBody),
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error.message);
    return { success: true, id: result.id, platform: "facebook" };
  } catch (err: any) { 
    return { success: false, error: err.message, platform: "facebook" }; 
  }
}