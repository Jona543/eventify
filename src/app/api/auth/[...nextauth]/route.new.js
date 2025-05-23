import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const authHandler = NextAuth(authOptions);

export async function GET(req, res) {
  return await authHandler(req, res);
}

export async function POST(req, res) {
  return await authHandler(req, res);
}

export async function PATCH(req, res) {
  return await authHandler(req, res);
}

export async function DELETE(req, res) {
  return await authHandler(req, res);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

export default NextAuth(authOptions);
