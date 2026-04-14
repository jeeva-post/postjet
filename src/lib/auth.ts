import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
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
        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection("users").findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() },
              { mobile: credentials.identifier }
            ]
          });
          if (!user || !user.password) return null;
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          return { id: user._id.toString(), name: user.name, email: user.email };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  // SECRET ఇక్కడ పక్కాగా ఉండాలి
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_build_only",
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    }
  }
};