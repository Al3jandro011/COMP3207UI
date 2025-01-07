"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventTile from '@/components/EventTile';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getAllEvents } from '@/services/apiServices';
import { useRouter } from 'next/navigation';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const allEvents = response.data?.events || [];
        setEvents(allEvents);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="p-4 sm:p-8 text-gray-600 dark:text-gray-400">Loading events...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">All Events</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse and manage all available events</p>
      </div>

      <div className="relative">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl 
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                       focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        
        {error ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No events found. Please try again later.
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            {searchTerm ? 'No events match your search.' : 'No events available at this time.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <EventTile
                key={event.event_id}
                id={event.event_id}
                {...(event.img_url && { imageUrl: event.img_url })}
                title={event.name}
                description={event.desc}
              />
            ))}
          </div>
        )}

        <Link href="/events/add" className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 px-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                                          rounded-full flex items-center justify-center shadow-lg hover:from-cyan-400 hover:to-blue-400 
                                          transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none group z-20">
          <PlusIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <span className="ml-2 text-white font-medium hidden sm:inline">Add Event</span>
        </Link>
      </div>
    </div>
  );
}