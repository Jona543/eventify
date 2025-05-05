import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/authOptions";

const handler = async (req, res) => {
  const authOptions = await getAuthOptions();
  console.log("Initializing auth with options");
  return NextAuth(authOptions)(req, res);
};

const authHandler = async (...args) => {
  const options = await getAuthOptions();
  return NextAuth(options)(...args);
};

export const GET = authHandler;
export const POST = authHandler;
