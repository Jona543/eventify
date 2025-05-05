// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const authOptionsPromise = getAuthOptions();
const handler = NextAuth(authOptionsPromise);

export { handler as GET, handler as POST };
