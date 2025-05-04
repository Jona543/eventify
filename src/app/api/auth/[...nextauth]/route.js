// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const handler = async (req) => {
  const options = await getAuthOptions();
  return NextAuth(req, options);
};

export const GET = handler;
export const POST = handler;
