import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google Provider (For YouTube Uploads)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // YouTube upload కి కావాల్సిన scopes ఇక్కడ ఉన్నాయి
          scope: "openid email profile https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",
          prompt: "consent",
          access_type: "offline", // Refresh token పొందడానికి ఇది అవసరం
          response_type: "code",
        },
      },
    }),

    // 2. Facebook Provider (For Pages & Instagram)
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          // Facebook Pages మరియు Instagram కి కావాల్సిన పర్మిషన్స్
          scope: "email,public_profile,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish",
        },
      },
    }),
  ],

  callbacks: {
    // లాగిన్ అయినప్పుడు టోకెన్‌ని పట్టుకోవడానికి
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },

    // ఆ టోకెన్‌ని ఫ్రంటెండ్ సెషన్‌కి మరియు బ్యాకెండ్ API కి పంపడానికి
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // కావాలంటే కస్టమ్ లాగిన్ పేజీ ఇక్కడ ఇచ్చుకోవచ్చు
  pages: {
    signIn: "/", 
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };