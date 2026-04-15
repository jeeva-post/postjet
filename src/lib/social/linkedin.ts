export async function postToLinkedIn(content: string, mediaUrl: string | null, isVideo: boolean, accessToken: string) {
  try {
    // 1. ముందుగా నీ లింక్డిన్ Profile ID (URN) ని తెచ్చుకోవాలి
    const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userRes.json();
    const personURN = `urn:li:person:${userData.sub}`;

    // 2. పోస్ట్ బాడీని తయారు చేయడం
    const body: any = {
      author: personURN,
      commentary: content,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [] },
      lifecycleState: "PUBLISHED",
    };

    if (mediaUrl) {
      body.content = {
        article: {
          title: "PostJet Update",
          description: content,
          source: mediaUrl,
        }
      };
    }

    const res = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401", // లేటెస్ట్ వర్షన్
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("LinkedIn Posting Failed");
    return { success: true, platform: "linkedin" };
  } catch (err: any) {
    return { success: false, error: err.message, platform: "linkedin" };
  }
}