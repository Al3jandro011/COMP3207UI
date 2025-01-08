"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventTile from '@/components/sidebar/EventTile';
import { MagnifyingGlassIcon, ClockIcon, TicketIcon, UsersIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getAllEvents, getUserTickets } from '@/services/apiServices';
const TEST_USER_ID = "7ef177e5-17ef-4baa-940a-83ccd4bb33c7";

export default function Home() {
  const [eventsByGroup, setEventsByGroup] = useState({});
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, eventsResponse] = await Promise.all([
          getUserDetails({ user_id: TEST_USER_ID }),
          getAllEvents()
        ]);

        const userGroups = userResponse.data.user.groups || [];
        setUserGroups(userGroups);

        const allEvents = eventsResponse.data.events || [];
        
        // Group events by their respective groups
        const groupedEvents = userGroups.reduce((acc, group) => {
          acc[group] = allEvents.filter(event => 
            event.groups?.includes(group)
          );
          return acc;
        }, {});

        setEventsByGroup(groupedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load suggestions');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600 dark:text-gray-400">Loading suggestions...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // Check if there are any events at all
  const hasEvents = Object.values(eventsByGroup).some(events => events.length > 0);

  return (
    <div className="flex">
          <div className="flex-1 p-8 max-w-7xl">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Welcome to EVECS</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover and manage your ECS events</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl 
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500
                     focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <ClockIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{upcomingEvents.length}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming Events</p>
        </div>

        {!hasEvents ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No events found for your groups.
          </div>
        ) : (
          <div className="space-y-12">
            {userGroups.map(group => {
              const groupEvents = eventsByGroup[group] || [];
              
              // Skip groups with no events
              if (groupEvents.length === 0) return null;

              return (
                <div key={group} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 
                               border-b border-gray-200 dark:border-gray-700 pb-2">
                    {group} Events
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupEvents.map((event) => (
                      <EventTile
                        key={event.event_id}
                        id={event.event_id}
                        imageUrl={event.img_url || "/example.jpg"}
                        title={event.name || 'Untitled Event'}
                        description={event.desc || 'No description available'}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link 
          href="/events" 
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 px-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                    rounded-full flex items-center justify-center shadow-lg hover:from-cyan-400 hover:to-blue-400 
                    transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none group z-20"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 10h16M4 14h16M4 18h16" 
            />
          </svg>
          <span className="ml-2 text-white font-medium hidden sm:inline">All Events</span>
        </Link>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}