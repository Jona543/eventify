// src/auth.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function auth() {
    console.log('📦 auth.js loaded');  // Debugging

  return await getServerSession(authOptions);
}
