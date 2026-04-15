import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, platforms, accessToken } = await req.json();
    console.log("🚀 PostJet Blast sequence initiated for:", platforms);

    const results = [];

    // --- 1. TELEGRAM SECTION (నీ పాత సక్సెస్ కోడ్) ---
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
        results.push({ platform: "telegram", status: telData.ok ? "success" : "error" });
        console.log("Telegram Blast Status:", telData.ok ? "✅" : "❌");
      }
    }

    // --- 2. FACEBOOK SECTION (కొత్త పక్కా లాజిక్) ---
    if (platforms.includes("facebook")) {
      const pageId = process.env.FACEBOOK_PAGE_ID;

      if (!accessToken || !pageId) {
        results.push({ platform: "facebook", status: "error", message: "Token or Page ID missing" });
      } else {
        // A. ముందుగా నీ యూజర్ టోకెన్ తో నీ పేజీల లిస్ట్ అడుగుదాం
        const accountsUrl = `https://graph.facebook.com/me/accounts?access_token=${accessToken}`;
        const accountsRes = await fetch(accountsUrl);
        const accountsData = await accountsRes.json();

        // B. మనకు కావలసిన Page ID కి సరిపోయే "Page Access Token" ని వెతుకుదాం
        const targetPage = accountsData.data?.find((p: any) => p.id === pageId);

        if (!targetPage) {
          results.push({ platform: "facebook", status: "error", message: "Page not found in your account" });
        } else {
          // C. ఇప్పుడు దొరికిన Page Access Token తో అసలైన పోస్ట్ చేద్దాం
          const fbUrl = `https://graph.facebook.com/${pageId}/feed`;
          const fbRes = await fetch(fbUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content,
              access_token: targetPage.access_token, // ఇక్కడ పేజీ టోకెన్ వాడుతున్నాం
            }),
          });
          const fbData = await fbRes.json();
          results.push({ platform: "facebook", status: fbData.id ? "success" : "error" });
          console.log("Facebook Blast Status:", fbData.id ? "✅" : "❌");
        }
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error("🔥 Global Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}