import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // తాత్కాలికంగా అడాప్టర్ తీసేశాం - డేటాబేస్ కనెక్షన్ అవసరం లేదు
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // కేవలం టోకెన్ ఆధారంగా లాగిన్
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // ఎర్రర్స్ కనిపిస్తాయి
};