import EventsList from './components/EventsList';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Eventify</h1>
      <p className="text-lg mb-8 text-gray-600">Manage events with ease.</p>
      <div className="space-x-4">
        <EventsList />
      </div>
    </main>
  );
}
