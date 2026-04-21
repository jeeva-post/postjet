import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

async function syncUser(user: any) {
  if (!user) return;
  const client = await clientPromise;
  const db = client.db("postjet");
  
  await db.collection("users").updateOne(
    { kindeId: user.id },
    {
      $set: {
        kindeId: user.id,
        email: user.email,
        name: `${user.given_name} ${user.family_name}`,
        image: user.picture,
        updatedAt: new Date(),
      },
    },
    { upsert: true } // యూజర్ లేకపోతే కొత్తగా క్రియేట్ చేస్తుంది
  );
}

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  await syncUser(user); // ఇక్కడ డేటా సేవ్ అవుతుంది

  return (
    <div className="p-10">
      <h1 className="text-4xl font-black italic uppercase">Dashboard</h1>
      <p className="mt-4 text-slate-600 font-bold">Welcome, {user?.given_name}! Your profile is synced with MongoDB.</p>
    </div>
  );
}