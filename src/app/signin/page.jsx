'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      router.push('/');
    } else {
      alert('Login failed');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' }); // Automatically redirects to Google's sign-in
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Sign In
        </button>
      </form>

      <div className="text-center mb-4">or</div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
      >
        Sign in with Google
      </button>
      <p className="text-center text-sm mt-4">
        New here?{' '}
        <a href="/signup" className="text-blue-600 underline">
          Create an account
        </a>
      </p>
    </main>
  );
}
