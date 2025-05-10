
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

console.log("[authHelper] typeof authOptions:", typeof authOptions);
console.log("[authHelper] authOptions keys:", Object.keys(authOptions));

export async function auth() {
  return await getServerSession(authOptions);
}
