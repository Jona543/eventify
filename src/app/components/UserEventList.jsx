'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EventCard from '@/app/components/EventCard';

export default function UserEventList() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/users/events');
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    };

    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status]);

  const handleRegister = async (eventId) => {
    const res = await fetch('/api/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      const updated = await fetch('/api/users/events');
      setEvents(await updated.json());
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
  

  if (status === 'loading' || loading) return <p>Loading your events...</p>;
  if (!session) return <p>You need to sign in to view and register for events.</p>;
  if (events.length === 0) return <p>You are not registered for any events yet.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Your Events</h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event._id}>
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
    </div>
  );
}
