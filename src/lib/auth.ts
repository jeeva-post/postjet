import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs"; // npm install bcryptjs
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Mobile", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db();
        
        // ఇమెయిల్ లేదా మొబైల్ నంబర్ తో యూజర్ ని వెతకడం
        const user = await db.collection("users").findOne({
          $or: [
            { email: credentials.identifier },
            { mobile: credentials.identifier }
          ]
        });

        if (!user || !user.password) {
          throw new Error("User not found!");
        }

        // పాస్‌వర్డ్ సరిపోల్చడం
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password!");
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // నీ సొంత లాగిన్ పేజీ
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) session.user.id = token.id;
      return session;
    }
  }
};