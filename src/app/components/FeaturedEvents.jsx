"use client";

import EventCard from "@/app/components/EventCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/events/featured");
        if (!res.ok) {
          console.error("Failed to fetch featured events");
          return;
        }

        const data = await res.json();
        let featured = data.events || [];

        if (session?.user?.email) {
          const userRes = await fetch("/api/users/events");
          const userEvents = await userRes.json();
          const registeredIds = new Set(userEvents.map((e) => e._id));

          featured = featured.map((event) => ({
            ...event,
            registered: registeredIds.has(event._id),
          }));
        }

        setFeaturedEvents(featured);
      } catch (err) {
        console.error("Error fetching featured events:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchFeatured();
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
        setFeaturedEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, registered: true } : event
          )
        );
      }
    } catch (err) {
      console.error("Error registering for event:", err);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const res = await fetch("/api/events/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (res.ok) {
        setFeaturedEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, registered: false } : event
          )
        );
      }
    } catch (err) {
      console.error("Error unregistering from event:", err);
    }
  };

  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Loading featured events...
      </p>
    );
  }

  if (featuredEvents.length === 0) {
    return (
      <p role="status" aria-live="polite">
        No featured events yet!
      </p>
    );
  }

  return (
    <section
      aria-labelledby="featured-events-heading"
      className="max-w-2xl mx-auto"
    >
      <h2 id="featured-events-heading" className="text-2xl font-bold mb-4">
        🌟 Featured Events
      </h2>
      <ul className="space-y-4">
        {featuredEvents.map((event) => (
          <li key={event._id} aria-labelledby={`event-${event._id}`}>
            <EventCard
              event={event}
              userEmail={session?.user?.email}
              provider={
                session?.user?.email?.endsWith("@gmail.com") ? "google" : null
              }
              userRole={session?.user?.role}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
              onEdit={() => router.push(`/events/edit/${event._id}`)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
