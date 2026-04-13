import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ఇది వెర్సెల్ బిల్డ్ ఎర్రర్‌ని (Failed to collect page data) ఫిక్స్ చేస్తుంది
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };