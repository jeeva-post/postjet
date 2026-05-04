import { postToFacebook } from "@/lib/social/facebook";
import { postToInstagram } from "@/lib/social/instagram";
import { postToLinkedIn } from "@/lib/social/linkedin";
import { postToTelegram } from "@/lib/social/telegram";
import { postToPinterest } from "@/lib/social/pinterest";
import { postToYouTube } from "@/lib/social/youtube";
import { removeMediaObject } from "./supabase";
import { schedulePost } from "./scheduler";

export type PostRequestPayload = {
  content: string;
  platforms: string[];
  mediaUrl?: string;
  scheduledAt?: string;
  accessTokens?: Record<string, string>;
  subscriptionTier?: string;
};

function parseSupabasePath(url: string) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const bucketIndex = parts.indexOf("o") + 1;
    if (bucketIndex > 0 && parts[bucketIndex]) {
      return { bucket: parts[bucketIndex], path: parts.slice(bucketIndex + 1).join("/") };
    }
    return null;
  } catch {
    return null;
  }
}

export async function handlePostRequest(payload: PostRequestPayload) {
  const { content, platforms = [], mediaUrl, scheduledAt, accessTokens = {}, subscriptionTier } = payload;
  const isVideo = !!mediaUrl && /\.(mp4|mov|avi|webm)$/i.test(mediaUrl);

  if (scheduledAt) {
    const result = await schedulePost({ content, platforms, mediaUrl, scheduledAt, subscriptionTier });
    return { success: result.success, scheduled: true, error: result.error, data: result.data };
  }

  const tasks = platforms.map((platform) => {
    switch (platform) {
      case "facebook":
        return postToFacebook(content, mediaUrl || "", isVideo, accessTokens.facebook || "");
      case "instagram":
        return mediaUrl ? postToInstagram(content, mediaUrl, isVideo, accessTokens.instagram || accessTokens.facebook || "") : Promise.resolve({ success: false, platform: "instagram", error: "Media required" });
      case "linkedin":
        return postToLinkedIn(content, mediaUrl || null, isVideo, accessTokens.linkedin || "");
      case "telegram":
        return postToTelegram(content, mediaUrl || null, isVideo);
      case "pinterest":
        return mediaUrl ? postToPinterest(content, mediaUrl, accessTokens.pinterest || "") : Promise.resolve({ success: false, platform: "pinterest", error: "Media required" });
      case "youtube":
        return mediaUrl ? postToYouTube(content, mediaUrl, accessTokens.youtube || "") : Promise.resolve({ success: false, platform: "youtube", error: "Video required" });
      default:
        return Promise.resolve({ success: false, platform, error: "Unknown platform" });
    }
  });

  const results = await Promise.allSettled(tasks);
  const formatted = results.map((result) => result.status === "fulfilled" ? result.value : { success: false, error: (result as PromiseRejectedResult).reason?.message || "Unknown error" });
  const allSuccess = formatted.length > 0 && formatted.every((item) => item.success);

  if (allSuccess && mediaUrl) {
    const parsed = parseSupabasePath(mediaUrl);
    if (parsed) {
      await removeMediaObject(parsed.bucket, parsed.path);
    }
  }

  return {
    success: formatted.some((item) => item.success),
    allSuccess,
    results: formatted,
    deleted: allSuccess && !!mediaUrl,
  };
}
