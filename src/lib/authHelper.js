// src/lib/authHelper.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

console.log("[authHelper] typeof authOptions:", typeof authOptions); // should be 'object'
console.log("[authHelper] authOptions keys:", Object.keys(authOptions)); // should list 'providers', 'callbacks', etc.

export async function auth() {
  return await getServerSession(req, { ...authOptions });
}
