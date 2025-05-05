// src/lib/authHelper.js
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

export async function auth() {
  return await getServerSession(await getAuthOptions());
}
