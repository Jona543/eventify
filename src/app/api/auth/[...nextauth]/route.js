// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

export const GET = async (req) => {
  const options = await getAuthOptions();
  const handler = NextAuth(options);
  return handler(req);
};

export const POST = async (req) => {
  const options = await getAuthOptions();
  const handler = NextAuth(options);
  return handler(req);
};
