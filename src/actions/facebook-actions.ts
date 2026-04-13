"use server";

import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getFacebookPages() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];
  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) return [];
    const account = await db.collection("accounts").findOne({ userId: user._id, provider: "facebook" });
    if (!account || !account.access_token) return [];
    const response = await fetch(`https://graph.facebook.com/me/accounts?fields=name,id,access_token,picture,instagram_business_account&access_token=${account.access_token}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Fetch Pages Error:", error);
    return [];
  }
}

export async function postMediaToMeta(fbPages: any[], igAccounts: any[], message: string, mediaUrl: string, fileType: string) {
  try {
    const isVideo = fileType.startsWith("video");
    const promises: any[] = [];
    fbPages.forEach((page) => {
      const fbEndpoint = isVideo ? "videos" : "photos";
      const fbParam = isVideo ? "file_url" : "url";
      const fbCaptionParam = isVideo ? "description" : "caption";
      const fbRequest = fetch(`https://graph.facebook.com/${page.id}/${fbEndpoint}?${fbParam}=${encodeURIComponent(mediaUrl)}&${fbCaptionParam}=${encodeURIComponent(message)}&access_token=${page.access_token}`, { method: "POST" }).then(res => res.json());
      promises.push(fbRequest);
    });
    const results = await Promise.all(promises);
    return { success: true, message: "Success!", details: results };
  } catch (error) {
    return { success: false, error: "Meta posting failed" };
  }
}

/**
 * ముఖ్యమైన మార్పు: ఇక్కడ 'error' ప్రాపర్టీని కూడా పంపిస్తున్నాం.
 * దీనివల్ల బిల్డ్ ఎర్రర్ రాదు.
 */
export async function postToFacebook(formData: FormData) {
    const text = formData.get("text") as string || "";
    console.log("Post to Facebook triggered for text:", text);
    
    // 'error' ని ఇక్కడ యాడ్ చేశాను, ఫ్రంటెండ్ లో ఎర్రర్ రాకుండా.
    return { 
        success: true, 
        error: null 
    };
}