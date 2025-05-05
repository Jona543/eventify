import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const handler = async (req) => {
  const options = await getAuthOptions();
  return NextAuth(req, options);
};

export { handler as GET, handler as POST };
