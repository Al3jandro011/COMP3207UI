"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventTile from '@/components/sidebar/EventTile';
import { MagnifyingGlassIcon, ClockIcon, TicketIcon, UsersIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getAllEvents, getUserTickets } from '@/services/apiServices';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomGroups, setRandomGroups] = useState([]);
  const [subscribedCount, setSubscribedCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const allEvents = response.data?.events || [];

        // Get all unique groups from events
        const allGroups = [...new Set(allEvents.map(event => event.group))].filter(Boolean);
        
        // Randomly select up to 3 groups
        const selectedGroups = allGroups
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setRandomGroups(selectedGroups);
        setEvents(allEvents);
      } catch (error) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchUserTickets = async () => {
        try {
            const response = await getUserTickets("7a2d3700-bc9b-4e1b-9b1e-4042df891474"); // Using test user ID
            const ticketCount = response.data?.subscription_count || 0;
            setSubscribedCount(ticketCount);
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            setSubscribedCount(0);
        }
    };

    fetchUserTickets();
  }, []);

  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= now && eventDate <= nextMonth;
    });
  };

  // Get events for a specific group
  const getGroupEvents = (group) => {
    return events.filter(event => event.group === group);
  };

  const getRandomGroupAndCount = () => {
    if (randomGroups.length === 0) return { group: 'Events', count: 0 };
    const randomGroup = randomGroups[Math.floor(Math.random() * randomGroups.length)];
    const count = getGroupEvents(randomGroup).length;
    return { group: randomGroup, count };
  };

  if (loading) return <div className="p-8 text-gray-600 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="p-8 max-w-7xl mx-auto">
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
        
        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <TicketIcon className="w-6 h-6 text-purple-500 dark:text-purple-400 mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {subscribedCount}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Subscribed Events</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <UsersIcon className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{getRandomGroupAndCount().count}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Upcoming {getRandomGroupAndCount().group} Events
          </p>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upcoming Events in ECS</h2>
          <Link href="/events" className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center space-x-1 text-sm font-medium">
            <span>View all</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.slice(0, 3).map(event => (
            <EventTile 
              key={event.event_id}
              id={event.event_id}
              imageUrl={event.img_url || "/example.jpg"}
              title={event.name}
              description={event.desc}
            />
          ))}
        </div>
      </section>

      {randomGroups.map(group => (
        <section key={group} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{group} Related Events</h2>
            <Link href="/events" className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center space-x-1 text-sm font-medium">
              <span>View all</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getGroupEvents(group).slice(0, 3).map(event => (
              <EventTile 
                key={event.event_id}
                id={event.event_id}
                imageUrl={event.img_url || "/example.jpg"}
                title={event.name}
                description={event.desc}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}