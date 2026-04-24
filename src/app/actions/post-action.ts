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
  const accounts = await db.collection("accounts").find({ userId: user?.id }).toArray();

  const tasks = [];
  for (const p of selected) {
    const acc = accounts.find(a => a.platform === p);
    if (!acc && p !== "WhatsApp" && p !== "Telegram") continue;

    if ((p === "Facebook" || p === "Instagram") && acc) {
      tasks.push(fetch(`https://graph.facebook.com/v19.0/${acc.config.pageId || acc.config.id}/feed?message=${encodeURIComponent(content)}&access_token=${acc.config.token}`, { method: "POST" }));
    }

    if (p === "Telegram") {
      tasks.push(fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: content })
      }));
    }

    if (p === "WhatsApp") {
      tasks.push(fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_RECIPIENT_ID,
          type: "text",
          text: { body: content }
        })
      }));
    }
  }

  await Promise.allSettled(tasks);
  return { success: true };
}