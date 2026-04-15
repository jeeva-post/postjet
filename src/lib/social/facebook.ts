export async function postToFacebook(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const accData = await accRes.json();
    const page = accData.data?.find((p: any) => p.id === pageId);

    if (!page) throw new Error("Page not found");

    let endpoint = mediaUrl ? (isVideo ? `/${pageId}/videos` : `/${pageId}/photos`) : `/${pageId}/feed`;
    const fbBody: any = { access_token: page.access_token };
    
    if (mediaUrl) {
      if (isVideo) { fbBody.file_url = mediaUrl; fbBody.description = content; }
      else { fbBody.url = mediaUrl; fbBody.caption = content; }
    } else fbBody.message = content;

    const res = await fetch(`https://graph.facebook.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fbBody),
    });
    return await res.json();
  } catch (err) { return { error: err }; }
}