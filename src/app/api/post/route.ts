import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { schedulePost } from "@/lib/scheduler";
import { postToFacebook } from "./platforms/facebook";
import { postToInstagram } from "./platforms/instagram";
import { postToLinkedIn } from "./platforms/linkedin";
import { postToWhatsApp } from "./platforms/whatsapp";

type PostPayload = {
  platform?: string;
  platforms?: string[];
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  pageId?: string;
  scheduledAt?: string;
  subscriptionTier?: string;
};

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

async function getConnection(userId: string, platform: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase configuration is missing");

  const { data, error } = await supabase
    .from("user_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", platform)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read ${platform} connection: ${error.message}`);
  }

  return data as any;
}

function detectMediaType(mediaUrl?: string, explicitType?: string) {
  if (explicitType) return explicitType;
  if (!mediaUrl) return "text";
  return /\.(mp4|mov|avi|webm)$/i.test(mediaUrl) ? "video" : "image";
}

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase environment variables are missing" }, { status: 500 });
    }

    const body = (await req.json()) as PostPayload;
    console.log('[POST /api/post] received body:', body);
    const { platform, platforms, content, mediaUrl, mediaType: explicitMediaType, pageId } = body;
    const requestedPlatforms = Array.isArray(platforms)
      ? platforms.map((p) => p.toLowerCase())
      : platform
      ? [platform.toLowerCase()]
      : [];

    if (requestedPlatforms.length === 0) {
      return NextResponse.json({ error: "Platform or platforms are required" }, { status: 400 });
    }

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: "Content or mediaUrl is required" }, { status: 400 });
    }

    const user = await getSupabaseUser();
    const finalMediaType = detectMediaType(mediaUrl, explicitMediaType);

    if (body.scheduledAt) {
      const scheduleResult = await schedulePost({
        content: content || "",
        platforms: requestedPlatforms,
        mediaUrl,
        scheduledAt: body.scheduledAt,
        subscriptionTier: body.subscriptionTier,
      });
      return NextResponse.json({ success: scheduleResult.success, scheduled: true, error: scheduleResult.error, data: scheduleResult.data });
    }

    const results: Array<{ success: boolean; platform: string; error?: string; data?: any }> = [];

    for (const target of requestedPlatforms) {
      const normalized = target?.trim().toLowerCase();
      if (!normalized) {
        results.push({ success: false, platform: target || "unknown", error: "Invalid platform" });
        continue;
      }

      try {
        if (normalized === "facebook" || normalized === "instagram") {
          let connection = await getConnection(user.id, "facebook");
          let pageToken: string | undefined;
          let pageIdentifier: string | undefined;
          const connectionPageToken = connection?.page_access_token;

          if (connection?.access_token) {
            console.log('[POST /api/post] Facebook connection found for user', { hasAccessToken: true, requestedPageId: pageId });
            const pageRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${connection.access_token}`);
            const pageData = await pageRes.json();
            console.log("Facebook Pages Response:", pageData, "requestedPageId:", pageId);

            if (!pageRes.ok) {
              throw new Error(pageData.error?.message || "Unable to fetch Facebook page list");
            }

            const pageInfo = pageId
              ? pageData.data?.find((page: any) => page.id === pageId)
              : pageData.data?.[0];

            if (!pageInfo) {
              throw new Error(pageId
                ? `Facebook page ID ${pageId} was not found in the connected account list.`
                : "No Facebook page was found for the connected account.");
            }

            if (!pageInfo.access_token && !connectionPageToken) {
              throw new Error("Missing Facebook Page Access Token for the selected page.");
            }

            pageToken = pageInfo.access_token || connectionPageToken;
            pageIdentifier = pageInfo.id;
          } else {
            // Fallback to env tokens for testing
            console.log('[POST /api/post] No Facebook connection found, using env fallback');
            pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
            pageIdentifier = pageId || process.env.FACEBOOK_PAGE_ID;
            if (!pageToken || !pageIdentifier) {
              throw new Error("No Facebook connection or env tokens available");
            }
          }

          console.log("Posting to Facebook Page:", { pageIdentifier, usingPageAccessToken: Boolean(pageToken) });

          if (normalized === "facebook") {
            const result = await postToFacebook(content || "", mediaUrl || "", finalMediaType, pageIdentifier, pageToken);
            results.push({ success: true, platform: "facebook", data: result });
          } else {
            const result = await postToInstagram(content || "", mediaUrl || "", finalMediaType, pageIdentifier, pageToken);
            results.push({ success: true, platform: "instagram", data: result });
          }

          continue;
        }

        if (normalized === "linkedin") {
          let connection = await getConnection(user.id, "linkedin");
          let accessToken: string | undefined;

          if (connection?.access_token) {
            accessToken = connection.access_token;
          } else {
            // Fallback to env token
            accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
            if (!accessToken) {
              throw new Error("No LinkedIn connection or env token available");
            }
          }

          const result = await postToLinkedIn(content || "", mediaUrl || "", finalMediaType, accessToken);
          results.push({ success: true, platform: "linkedin", data: result });
          continue;
        }

        if (normalized === "whatsapp") {
          let connection = await getConnection(user.id, "whatsapp");
          let accessToken: string | undefined;
          let phoneNumberId: string | undefined;
          let recipientNumber: string | undefined;

          if (connection?.access_token) {
            accessToken = connection.access_token;
            phoneNumberId = connection?.metadata?.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;
            recipientNumber = connection?.metadata?.recipient_number || process.env.WHATSAPP_RECIPIENT_NUMBER;
          } else {
            // Fallback to env tokens
            accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
            phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER;
            if (!accessToken || !phoneNumberId || !recipientNumber) {
              throw new Error("No WhatsApp connection or env tokens available");
            }
          }

          const result = await postToWhatsApp(content || "", mediaUrl || "", accessToken, phoneNumberId, recipientNumber);
          results.push({ success: true, platform: "whatsapp", data: result });
          continue;
        }

        results.push({ success: false, platform: normalized, error: `Platform '${normalized}' is not supported by this endpoint.` });
      } catch (error: any) {
        const message = error?.message || String(error);
        console.error(`[POST /api/post] ${normalized} error:`, message);
        results.push({ success: false, platform: normalized, error: message });
      }
    }

    return NextResponse.json({
      success: results.some((item) => item.success),
      results,
    });
  } catch (error: any) {
    console.error("[API POST ERROR]:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
