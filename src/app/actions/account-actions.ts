"use server";
import clientPromise from "../../lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function linkAccount(data: {
  platform: string;
  accountName: string;
  config: any;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) throw new Error("Unauthorized");

  const client = await clientPromise;
  const db = client.db("postjet");

  await db.collection("accounts").updateOne(
    { userId: user.id, platform: data.platform },
    {
      $set: {
        userId: user.id,
        platform: data.platform,
        accountName: data.accountName,
        config: data.config,
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  revalidatePath("/dashboard/accounts");
  return { success: true };
}

export async function getUserAccounts() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) return [];

  const client = await clientPromise;
  const db = client.db("postjet");
  const accounts = await db.collection("accounts").find({ userId: user.id }).toArray();
  
  return accounts.map(acc => ({
    id: acc._id.toString(),
    platform: acc.platform,
    accountName: acc.accountName,
    config: acc.config
  }));
}