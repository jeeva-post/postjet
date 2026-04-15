import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken } = await req.json();
    console.log("🚀 PostJet Triple Blast Initiated!");

    const results = [];

    // --- 1. TELEGRAM SECTION ---
    if (platforms.includes("telegram")) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (botToken && chatId) {
        const telRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: content }),
        });
        const telData = await telRes.json();
        results.push({ platform: "telegram", success: telData.ok });
      }
    }

    // --- 2. FACEBOOK & INSTAGRAM SECTION ---
    if (platforms.includes("facebook") || platforms.includes("instagram")) {
      const pageId = process.env.FACEBOOK_PAGE_ID;
      
      // Page Access Token తెచ్చుకుందాం
      const accountsUrl = `https://graph.facebook.com/me/accounts?access_token=${accessToken}`;
      const accountsRes = await fetch(accountsUrl);
      const accountsData = await accountsRes.json();
      const targetPage = accountsData.data?.find((p: any) => p.id === pageId);

      if (targetPage) {
        const pageAccessToken = targetPage.access_token;

        // FACEBOOK POST
        if (platforms.includes("facebook")) {
          const fbRes = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content, access_token: pageAccessToken }),
          });
          const fbData = await fbRes.json();
          results.push({ platform: "facebook", success: !!fbData.id });
        }

        // INSTAGRAM POST (Text only posts on IG need a different approach or Business ID)
        if (platforms.includes("instagram")) {
          const igBusinessId = process.env.INSTAGRAM_BUSINESS_ID; // Vercel లో యాడ్ చెయ్యి
          if (igBusinessId) {
            // గమనిక: Instagram లో కేవలం టెక్స్ట్ పోస్ట్ చేయడానికి సాధ్యం కాదు. 
            // దీనికి ఒక ఇమేజ్ కచ్చితంగా ఉండాలి. మనం Cloudinary సెట్ చేసాక ఇది పూర్తిగా పని చేస్తుంది.
            results.push({ platform: "instagram", status: "needs_image", message: "IG కి ఇమేజ్ కావాలి జీవన్!" });
          }
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}