// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/authOptions";

const handler = NextAuth(await getAuthOptions());

export { handler as GET, handler as POST };
