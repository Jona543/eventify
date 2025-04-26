'use client';
import EventCard from '@/app/components/EventCard'; // Assuming you already have an EventCard component
import { useEffect, useState } from 'react';

export default function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/events/featured'); // We'll create this API next
        if (res.ok) {
          const data = await res.json();
          setFeaturedEvents(data.events);
        } else {
          console.error('Failed to fetch featured events');
        }
      } catch (err) {
        console.error('Error fetching featured events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return <p>Loading featured events...</p>;
  }

  if (featuredEvents.length === 0) {
    return <p>No featured events yet!</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌟 Featured Events</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {featuredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
