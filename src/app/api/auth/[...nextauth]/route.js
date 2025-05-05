// app/api/auth/[...nextauth]/route.js (or .ts)
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
