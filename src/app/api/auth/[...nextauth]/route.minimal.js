import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Minimal auth handler
export default NextAuth(authOptions);
