import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ఇది వెర్సెల్ బిల్డ్ ఎర్రర్‌ని ఆపడానికి అతి ముఖ్యమైన లైన్
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };