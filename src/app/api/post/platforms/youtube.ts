export async function postToYouTube(content: string, mediaUrl: string) {
  try {
    // Variable names exactly as you provided
    const clientId = process.env.YOUTUBE_CLIENT_ID?.trim();
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET?.trim();
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN?.trim();

    // 38ms error ikkade aagipothundi if vars are missing
    if (!clientId || !clientSecret || !refreshToken) {
      const missing = [];
      if (!clientId) missing.push("YOUTUBE_CLIENT_ID");
      if (!clientSecret) missing.push("YOUTUBE_CLIENT_SECRET");
      if (!refreshToken) missing.push("YOUTUBE_REFRESH_TOKEN");
      
      throw new Error(`MISSING_ENV_VARS: ${missing.join(", ")} is undefined. Check your .env file!`);
    }

    console.log("Starting Auth Refresh...");

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(`Auth Error: ${tokenData.error}`);

    const accessToken = tokenData.access_token;

    // Media fetch
    const videoFetch = await fetch(mediaUrl);
    const videoBlob = await videoFetch.blob();

    // Metadata
    const safeTitle = content.split('\n')[0].substring(0, 80).replace(/[^\w\s]/gi, '') || "PostJet Update";

    // Resumable Upload
    const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Length': videoBlob.size.toString(),
        'X-Upload-Content-Type': videoBlob.type || 'video/mp4',
      },
      body: JSON.stringify({
        snippet: { title: safeTitle, description: content },
        status: { privacyStatus: "public", selfDeclaredMadeForKids: false }
      })
    });

    if (!initRes.ok) throw new Error("YouTube Session Init Failed");

    const uploadUrl = initRes.headers.get('Location');
    if (!uploadUrl) throw new Error("No Upload URL from Google");

    const finalRes = await fetch(uploadUrl, { method: 'PUT', body: videoBlob });

    if (finalRes.ok) {
      const data = await finalRes.json();
      return { success: true, id: data.id };
    }

    throw new Error("Final binary upload failed");

  } catch (error: any) {
    // Ikkada terminal lo chudandi, "MISSING_ENV_VARS" ani vastundha?
    console.error("🔴 YOUTUBE_DEBUG:", error.message);
    throw new Error(error.message);
  }
}