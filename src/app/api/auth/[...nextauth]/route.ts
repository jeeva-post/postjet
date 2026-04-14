import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      // ఇన్‌స్టాగ్రామ్ కోసం కూడా ఫేస్‌బుక్ లాగిన్ అవసరం
      authorization: {
        params: {
          scope: "email,public_profile,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };