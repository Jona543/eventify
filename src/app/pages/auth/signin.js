// pages/auth/signin.js
import { getCsrfToken } from "next-auth/react";

export default function SignIn({ csrfToken }) {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>Email</label>
      <input name="email" type="email" />
      <label>Password</label>
      <input name="password" type="password" />
      <button type="submit">Sign in</button>
    </form>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
