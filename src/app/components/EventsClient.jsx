'use client';

import { useSession } from 'next-auth/react';
import EventsList from './EventsList';
import CreateEvent from './CreateEvent';

export default function EventsClient() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  const isStaff = session?.user?.role === 'staff';

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      {isStaff && <CreateEvent />}
      <EventsList />
    </main>
  );
}
