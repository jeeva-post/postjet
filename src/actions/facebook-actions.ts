"use server";

import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

/**
 * 1. యూజర్ యొక్క Facebook Pages మరియు వాటికి లింక్ అయిన Instagram Accounts ని తెచ్చే ఫంక్షన్.
 */
export async function getFacebookPages() {
  const session = await getServerSession();
  if (!session?.user?.email) return [];

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) return [];

    const account = await db.collection("accounts").findOne({
      userId: user._id,
      provider: "facebook",
    });

    if (!account || !account.access_token) return [];

    // ఇన్‌స్టాగ్రామ్ బిజినెస్ అకౌంట్ వివరాలతో సహా పేజీలని అడుగుతున్నాం
    const response = await fetch(
      `https://graph.facebook.com/me/accounts?fields=name,id,access_token,picture,instagram_business_account&access_token=${account.access_token}`
    );
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Fetch Pages Error:", error);
    return [];
  }
}

/**
 * 2. సెలెక్ట్ చేసిన Facebook Pages మరియు Instagram Accounts కి మీడియా పంపే మెయిన్ ఫంక్షన్.
 */
export async function postMediaToMeta(
  fbPages: any[], 
  igAccounts: any[], 
  message: string, 
  mediaUrl: string, 
  fileType: string
) {
  const isVideo = fileType.startsWith("video");
  
  try {
    const promises: any[] = [];

    // --- A. Facebook పోస్టింగ్ లాజిక్ ---
    fbPages.forEach((page) => {
      const fbEndpoint = isVideo ? "videos" : "photos";
      const fbParam = isVideo ? "file_url" : "url";
      const fbCaptionParam = isVideo ? "description" : "caption";

      const fbRequest = fetch(
        `https://graph.facebook.com/${page.id}/${fbEndpoint}?${fbParam}=${encodeURIComponent(mediaUrl)}&${fbCaptionParam}=${encodeURIComponent(message)}&access_token=${page.access_token}`,
        { method: "POST" }
      ).then(res => res.json());
      
      promises.push(fbRequest);
    });

    // --- B. Instagram పోస్టింగ్ లాజిక్ ---
    igAccounts.forEach((ig) => {
      const mediaType = isVideo ? "VIDEO" : "IMAGE";
      const mediaParam = isVideo ? "video_url" : "image_url";

      const igRequest = (async () => {
        try {
          // 1. Instagram Media Container క్రియేట్ చేయడం
          const containerRes = await fetch(
            `https://graph.facebook.com/v19.0/${ig.id}/media?${mediaParam}=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(message)}&media_type=${mediaType}&access_token=${ig.access_token}`,
            { method: "POST" }
          );
          const containerData = await containerRes.json();

          if (!containerData.id) {
            console.error("IG Container Error:", containerData.error);
            return { error: containerData.error };
          }

          // 2. క్రియేట్ అయిన కంటైనర్ ని పబ్లిష్ చేయడం
          const publishRes = await fetch(
            `https://graph.facebook.com/v19.0/${ig.id}/media_publish?creation_id=${containerData.id}&access_token=${ig.access_token}`,
            { method: "POST" }
          );
          return await publishRes.json();
        } catch (err) {
          return { error: err };
        }
      })();
      
      promises.push(igRequest);
    });

    // అన్నీ ఒకేసారి రన్ చేస్తున్నాం
    const results = await Promise.all(promises);
    console.log("Meta Post Results:", results);

    return { success: true, message: "పోస్ట్ ప్రక్రియ పూర్తయ్యింది!", details: results };
  } catch (error) {
    console.error("Meta Posting Error:", error);
    return { success: false, message: "సర్వర్ లో ఎర్రర్ వచ్చింది." };
  }
}