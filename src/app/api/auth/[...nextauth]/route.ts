import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import PinterestProvider from "next-auth/providers/pinterest";

const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: { 
          scope: "email,public_profile,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish" 
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile https://www.googleapis.com/auth/youtube.upload" } },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      authorization: {
        params: { scope: "openid profile email w_member_social" },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    PinterestProvider({
      clientId: process.env.PINTEREST_CLIENT_ID!,
      clientSecret: process.env.PINTEREST_CLIENT_SECRET!,
      authorization: { params: { scope: "pins:read,pins:write,boards:read" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) { token.accessToken = account.access_token; }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Debug mode ఆన్ చేశాను, ఎర్రర్ వస్తే లాగ్స్ లో కనిపిస్తుంది
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };