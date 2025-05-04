// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const handler = async (req, res) => {
  const options = await getAuthOptions();
  return NextAuth(options)(req, res);
};

export const GET = handler;
export const POST = handler;
