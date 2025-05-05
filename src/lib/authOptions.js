import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise), // clientPromise is fine as-is
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user || !user.passwordHash) {
          throw new Error("This account does not support password login");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken ?? null;
      session.provider = token.provider ?? null;
      session.user = {
        ...session.user,
        id: token.sub ?? null,
        role: token.role ?? null,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};


