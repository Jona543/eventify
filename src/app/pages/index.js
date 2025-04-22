// example usage in pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>Welcome {session.user.name}!</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <p>You are not signed in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </div>
  );
}
