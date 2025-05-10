"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EventCard from "@/app/components/EventCard";

export default function UserEventList() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/users/events");
        if (!res.ok) {
          throw new Error("Failed to fetch user events");
        }
        const response = await res.json();
        if (response.success && Array.isArray(response.data)) {
          setEvents(
            response.data.map((event) => ({ ...event, registered: true }))
          );
        } else {
          console.error("Unexpected response format:", response);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [status]);

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (res.ok) {
        const updated = await fetch("/api/users/events");
        const response = await updated.json();
        if (response.success && Array.isArray(response.data)) {
          setEvents(
            response.data.map((event) => ({ ...event, registered: true }))
          );
        }
      } else {
        const error = await res.json();
        console.error("Registration failed:", error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleUnregister = async (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event._id !== eventId)
    );

    try {
      const res = await fetch("/api/events/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Unregistration failed:", error);

        const updated = await fetch("/api/users/events");
        const response = await updated.json();
        if (response.success && Array.isArray(response.data)) {
          setEvents(
            response.data.map((event) => ({ ...event, registered: true }))
          );
        }
      }
    } catch (error) {
      console.error("Error during unregistration:", error);
      try {
        const updated = await fetch("/api/users/events");
        const response = await updated.json();
        if (response.success && Array.isArray(response.data)) {
          setEvents(
            response.data.map((event) => ({ ...event, registered: true }))
          );
        }
      } catch (fetchError) {
        console.error("Error refetching events:", fetchError);
      }
    }
  };

  if (status === "loading" || loading) {
    return (
      <p role="status" aria-live="polite">
        Loading your events...
      </p>
    );
  }

  if (!session) {
    return (
      <p role="status" aria-live="polite">
        You need to sign in to view and register for events.
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p role="status" aria-live="polite">
        You are not registered for any events yet.
      </p>
    );
  }

  return (
    <section
      aria-labelledby="user-events-heading"
      className="mt-8 p-6 max-w-3xl mx-auto bg-white"
    >
      <h2 id="user-events-heading" className="text-lg font-semibold mb-3">
        Your Events
      </h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event._id} aria-labelledby={`event-${event._id}`}>
            <EventCard
              event={event}
              userEmail={session?.user?.email}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
              provider={session?.provider}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
