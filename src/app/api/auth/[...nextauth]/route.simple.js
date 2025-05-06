import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions.simple';

// Minimal auth handler
export default NextAuth(authOptions);
