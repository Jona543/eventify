'use client';

import { useEffect, useState } from 'react';
import EventCard from '@/app/components/EventCard'; // ⬅️ import the new component
import { useSession } from 'next-auth/react';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error('Unexpected data format:', data);
          setEvents([]);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    const res = await fetch('/api/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      const updated = await fetch('/api/events');
      const data = await updated.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        console.error('Unexpected data format after register:', data);
      }
    }
  };

  const handleUnregister = async (eventId) => {
    const res = await fetch('/api/events/unregister', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });
  
    if (res.ok) {
      const updated = await fetch('/api/users/events');
      setEvents(await updated.json());
    }
  };
  

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id}>
            <EventCard 
              event={event}
              onRegister={handleRegister} 
              userEmail={session?.user?.email}
              onUnregister={handleUnregister}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
