export async function postToFacebook(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const accData = await accRes.json();
    
    if (accData.error) throw new Error("FB Auth Error: " + accData.error.message);

    const page = accData.data?.find((p: any) => p.id === pageId);
    if (!page) throw new Error("Facebook Page ID match failed in your account.");

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
    
    const result = await res.json();
    if (result.error) throw new Error(result.error.message);
    return result;
  } catch (err: any) { 
    console.error("Facebook Error:", err.message);
    return { error: err.message || "Unknown Facebook Error" }; 
  }
}