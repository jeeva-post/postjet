import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ఈ లైన్ బిల్డ్ టైమ్ ఎర్రర్ రాకుండా కాపాడుతుంది
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };