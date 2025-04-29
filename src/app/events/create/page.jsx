"use client";

import CreateEvent from "@/app/components/CreateEvent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && !["staff"].includes(session.user.role)) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <p role="status" aria-live="polite" className="p-6">
        Loading...
      </p>
    );
  }

  return (
    <main role="main" className="max-w-2xl mx-auto p-6">
      <h1 id="create-event-heading" className="text-2xl font-bold mb-4">
        Create a New Event
      </h1>
      <CreateEvent />
    </main>
  );
}
