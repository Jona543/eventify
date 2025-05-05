// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

export const GET = async (req) => {
  const options = await getAuthOptions();
  return NextAuth(options).GET(req);
};

export const POST = async (req) => {
  const options = await getAuthOptions();
  return NextAuth(options).POST(req);
};
