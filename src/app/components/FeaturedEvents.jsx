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
        console.log("Fetching featured events...");
        const res = await fetch("/api/events/featured");
        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            "Failed to fetch featured events:",
            res.status,
            errorText
          );
          return;
        }

        let userEventsData = [];

        const data = await res.json();
        console.log("Featured events API response:", data);
        let featured = data.success ? data.data || [] : [];
        console.log("Processed featured events:", featured);

        if (session?.user?.email) {
          try {
            console.log("Fetching user events...");
            const userRes = await fetch("/api/users/events");
            const userResponse = await userRes.json();
            console.log("User events response:", userResponse);
            if (userResponse.success && Array.isArray(userResponse.data)) {
              userEventsData = userResponse.data;
              console.log("User registered events:", userEventsData);
            }
          } catch (userEventsError) {
            console.error("Error fetching user events:", userEventsError);
          }
        }

        const registeredIds = new Set(userEventsData.map((e) => e._id));
        console.log("Registered event IDs:", Array.from(registeredIds));

        const featuredWithRegistration = featured.map((event) => ({
          ...event,
          registered: registeredIds.has(event._id),
        }));

        console.log(
          "Final featured events with registration:",
          featuredWithRegistration
        );
        setFeaturedEvents(featuredWithRegistration);
      } catch (err) {
        console.error("Error fetching featured events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [status, session?.user?.email]);

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

  console.log("Rendering FeaturedEvents component:", {
    loading,
    featuredEvents,
  });

  if (featuredEvents.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🌟 Featured Events</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No featured events found. This could be because:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    There are no events marked as featured in the database
                  </li>
                  <li>The events are not marked with status 'upcoming'</li>
                  <li>There might be an issue with the database connection</li>
                </ul>
                <p className="mt-2">
                  Check the browser console for more detailed error information.
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
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
      {/* Login message for non-logged-in users */}
      {!session && (
        <p className="mt-4 text-center text-gray-600">
          Log in to register for events.
        </p>
      )}
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
              onRegister={session ? handleRegister : null}
              onUnregister={handleUnregister}
              onEdit={() => router.push(`/events/edit/${event._id}`)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
