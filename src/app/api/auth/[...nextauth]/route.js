import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

console.log("[route.js] typeof authOptions:", typeof authOptions);
console.log("[route.js] authOptions keys:", Object.keys(authOptions));

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };