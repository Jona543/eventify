import EventsList from "./components/EventsList";
import FeaturedEvents from "./components/FeaturedEvents";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Eventify</h1>
      <p className="text-lg mb-8 text-gray-600">Manage events with ease.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="order-2 md:order-1 md:col-span-2 mt-6 md:mt-0">
          <EventsList className="text-x1 font-bold mb-4" />
        </div>
        <div className="order-1 md:order-2 mt-6 md:mt-0">
          <FeaturedEvents className="text-xl font-bold mb-4" />
        </div>
      </div>
    </main>
  );
}
