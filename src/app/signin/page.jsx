"use client";

import SignInForm from "@/app/components/SignInForm";

export default function SignInPage() {
  return (
    <main role="main" className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <SignInForm />
      <p className="text-center text-sm mt-4">
        New here?{" "}
        <a
          href="/signup"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Create an account
        </a>
      </p>
    </main>
  );
}
