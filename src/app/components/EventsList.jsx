'use client';
import { useEffect, useState } from 'react';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
      setFilteredEvents(data.events || []);
    };

    fetchEvents();
  }, []);

  const handleTopicChange = (e) => {
    const topic = e.target.value;
    setSelectedTopic(topic);

    if (topic === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.topic === topic));
    }
  };

  return (
    <div>
      {/* Topic Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="topicFilter" className="mr-2 font-medium">Filter by Topic:</label>
        <select
          id="topicFilter"
          value={selectedTopic}
          onChange={handleTopicChange}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Tech">Tech</option>
          <option value="Sport">Sport</option>
          <option value="Business">Business</option>
          <option value="Health">Health</option>
        </select>
      </div>

      {/* Event List */}
      <ul className="space-y-2">
        {filteredEvents.map((event) => {
          const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <li key={event._id} className="border p-3 rounded shadow">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
              <p className="text-sm text-blue-600 font-medium">Topic: {event.topic}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
