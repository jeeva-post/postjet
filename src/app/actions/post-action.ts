"use server";
import clientPromise from "../../lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function postToAllPlatforms(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const content = formData.get("content") as string;
  const selected = JSON.parse(formData.get("selectedPlatforms") as string);

  const client = await clientPromise;
  const db = client.db("postjet");
  const userAccounts = await db.collection("accounts").find({ userId: user?.id }).toArray();

  const tasks = [];

  for (const p of selected) {
    const acc = userAccounts.find(a => a.platform === p);
    
    // --- 🔵 FACEBOOK ---
    if (p === "Facebook" && acc) {
      tasks.push(fetch(`https://graph.facebook.com/v19.0/${acc.config.pageId}/feed?message=${encodeURIComponent(content)}&access_token=${acc.config.token}`, { method: "POST" }));
    }

    // --- ✈️ TELEGRAM ---
    if (p === "Telegram") {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = acc?.config?.chatId || process.env.TELEGRAM_CHAT_ID;
      tasks.push(fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: content })
      }));
    }

    // --- 🟢 WHATSAPP ---
    if (p === "WhatsApp") {
      const waToken = process.env.WHATSAPP_TOKEN;
      const phoneId = process.env.WHATSAPP_PHONE_ID;
      const recipient = acc?.config?.id || process.env.WHATSAPP_RECIPIENT_ID;
      
      tasks.push(fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${waToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: { body: content }
        })
      }));
    }
  }

  await Promise.allSettled(tasks);
  return { success: true };
}