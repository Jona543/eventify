"use client";

import Head from "next/head";
import SignUpForm from "@/app/components/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Create Account | Eventify</title>
        <meta
          name="description"
          content="Sign up to Eventify and start managing your events."
        />
      </Head>

      <main role="main" className="max-w-sm mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <SignUpForm />
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Sign in
          </a>
        </p>
      </main>
    </>
  );
}
