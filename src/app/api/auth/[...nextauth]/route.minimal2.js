import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions.simple';

export default NextAuth(authOptions);
