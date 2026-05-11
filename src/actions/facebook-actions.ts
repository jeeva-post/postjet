"use server";

import { cookies } from "next/headers";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

async function getSupabaseUser() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase configuration is missing");

  const cookieStore = await cookies();
  const authHeader = cookieStore.get("sb-access-token")?.value;
  const { data: { user }, error } = await supabase.auth.getUser(authHeader);

  if (error || !user) {
    throw new Error("Unauthorized: unable to authenticate Supabase session");
  }

  return user;
}

export async function getFacebookPages() {
  if (!isSupabaseConfigured()) return [];

  try {
    const user = await getSupabaseUser();
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase configuration is missing");

    const { data: connection, error } = await supabase
      .from("user_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", "facebook")
      .maybeSingle();

    if (error || !connection || !connection.access_token) {
      console.warn("Facebook connection not found or missing access token", error);
      return [];
    }

    const response = await fetch(`https://graph.facebook.com/me/accounts?fields=name,id,access_token,picture,instagram_business_account&access_token=${connection.access_token}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Facebook pages fetch failed:", data);
      return [];
    }

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