"use client";
import EventCard from "@/app/components/EventCard"; // Assuming you already have an EventCard component
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
        const res = await fetch("/api/events/featured"); // We'll create this API next
        if (res.ok) {
          const data = await res.json();
          setFeaturedEvents(data.events);
        } else {
          console.error("Failed to fetch featured events");
        }
      } catch (err) {
        console.error("Error fetching featured events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) {
        // Refresh featured events after registering if needed
        const updated = await fetch("/api/events/featured");
        const data = await updated.json();
        setFeaturedEvents(data.events);
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
        // Refresh featured events after unregistering if needed
        const updated = await fetch("/api/events/featured");
        const data = await updated.json();
        setFeaturedEvents(data.events);
      }
    } catch (err) {
      console.error("Error unregistering from event:", err);
    }
  };

  if (loading) {
    return <p>Loading featured events...</p>;
  }

  if (featuredEvents.length === 0) {
    return <p>No featured events yet!</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌟 Featured Events</h2>
      <div>
        {featuredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            userEmail={session?.user?.email}
            provider={session?.provider}
            userRole={session?.user?.role} // if you have a role
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            selectedTopic={null}
            onEdit={(event) => router.push(`/events/edit/${event._id}`)}
          />
        ))}
      </div>
    </div>
  );
}
