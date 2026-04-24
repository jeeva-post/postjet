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
    if (!acc) continue;

    const token = acc.config.token;

    if (p === "Facebook") {
      tasks.push(fetch(`https://graph.facebook.com/v19.0/${acc.config.pageId}/feed?message=${encodeURIComponent(content)}&access_token=${token}`, { method: "POST" }));
    }
    if (p === "LinkedIn") {
      // LinkedIn Post Logic using the direct token
    }
    // ... ఇతర 11 యాప్స్ లాజిక్ ఇక్కడే ఉంటుంది
  }

  await Promise.allSettled(tasks);
  return { success: true };
}