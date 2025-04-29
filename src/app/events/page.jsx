import EventsClient from "@/app/components/EventsClient";

export default function EventsPage() {
  return (
    <main role="main" className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <EventsClient />
    </main>
  );
}
