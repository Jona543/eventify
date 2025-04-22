import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Eventify</h1>
      <p className="text-lg mb-8 text-gray-600">Manage users and events with ease.</p>

      <div className="space-x-4">
        <Link href="/users">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
            Manage Users
          </button>
        </Link>
        <Link href="/events">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded">
            Manage Events
          </button>
        </Link>
      </div>
    </main>
  );
}
