"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EventsList from "./EventsList";

export default function EventsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <p role="status" aria-live="polite">
        Loading events, please wait...
      </p>
    );
  }

  const isStaff = session?.user?.role === "staff";

  return (
    <div>
      {isStaff && (
        <button
          onClick={() => router.push("/events/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          aria-label="Create a new event"
          role="button"
        >
          Create Event
        </button>
      )}
      <EventsList />
    </div>
  );
}
