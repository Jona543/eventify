// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const handler = async (req, ctx) => {
  const options = await getAuthOptions();
  const authHandler = NextAuth(options);
  return authHandler(req, ctx);
};

export const GET = handler;
export const POST = handler;
