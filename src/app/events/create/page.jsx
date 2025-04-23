'use client'

import CreateEvent from '@/app/components/CreateEvent';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateEventPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && !['admin', 'staff'].includes(session.user.role)) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Event</h1>
      <CreateEvent />
    </main>
  );
}
