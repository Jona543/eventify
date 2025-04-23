import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  return NextResponse.json(token || { error: 'No token found' });
}
