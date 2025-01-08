"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventTile from '@/components/EventTile';
import { MagnifyingGlassIcon, ClockIcon, TicketIcon, UsersIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getAllEvents, getUserTickets, getUserDetails } from '@/services/apiServices';
const TEST_USER_ID = "7ef177e5-17ef-4baa-940a-83ccd4bb33c7";

export default function Home() {
  const [eventsByGroup, setEventsByGroup] = useState({});
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribedCount, setSubscribedCount] = useState(0);

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

  useEffect(() => {
    const fetchUserTickets = async () => {
        try {
            const response = await getUserTickets("7a2d3700-bc9b-4e1b-9b1e-4042df891474");
            const ticketCount = response.data?.subscription_count || 0;
            setSubscribedCount(ticketCount);
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            setSubscribedCount(0);
        }
    };

    fetchUserTickets();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600 dark:text-gray-400">Loading suggestions...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  const getUpcomingEvents = () => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const allEvents = Object.values(eventsByGroup).flat();
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate >= now && eventDate <= nextMonth;
    });
  };

  const getUpcomingEventsForFirstGroup = () => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const firstGroup = Object.entries(eventsByGroup).find(([_, events]) => events.length > 0);
    if (!firstGroup) return { group: 'No Group', count: 0 };
    
    const [groupName, events] = firstGroup;
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate >= now && eventDate <= nextMonth;
    });

    return { group: groupName, count: upcomingEvents.length };
  };

  const hasEvents = Object.values(eventsByGroup).some(events => events.length > 0);
  const upcomingEvents = getUpcomingEvents();
  const firstGroupStats = getUpcomingEventsForFirstGroup();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{firstGroupStats.count}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Upcoming {firstGroupStats.group} Events
          </p>
        </div>
      </div>

      {!hasEvents ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No events found for your groups.
        </div>
      ) : (
        <div className="space-y-16">
          {userGroups.map(group => {
            const groupEvents = eventsByGroup[group] || [];
            
            if (groupEvents.length === 0) return null;

            return (
              <div key={group} className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 
                             border-b border-gray-200 dark:border-gray-700 pb-4">
                  {group} Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
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
        <span className="ml-3 text-white font-medium hidden sm:inline">All Events</span>
      </Link>
    </div>
  );
}