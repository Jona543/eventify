import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/authOptions";

const handler = async (req, res) => {
  try {
    const options = await getAuthOptions();
    await NextAuth(req, res, options);  // Corrected usage
  } catch (error) {
    console.error("NextAuth handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GET = handler;
export const POST = handler;
