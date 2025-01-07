"use client";

import Link from 'next/link';
import EventTile from '@/components/EventTile';
import { ClockIcon, TicketIcon, UsersIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { makeCalendar, getLocationsAndGroups } from '@/services/apiServices';


export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationsAndGroups, setLocationsAndGroups] = useState([]);
  const [randomGroup, setRandomGroup] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await getLocationsAndGroups();
        setLocationsAndGroups(groupsData);
        const groups = groupsData.groups || [];
        if (groups.length > 0) {
          const shuffled = [...groups].sort(() => 0.5 - Math.random());
          setRandomGroup(shuffled.slice(0, 3));
        }

        const today = new Date();
        const data = {
          start_date: today.toISOString(),
          end_date: new Date(today.getFullYear() + 100, today.getMonth(), today.getDate()).toISOString()
        };

        const response = await makeCalendar(data);
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Welcome to EVECS</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover and manage your ECS events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <ClockIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">12</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming Events</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <TicketIcon className="w-6 h-6 text-purple-500 dark:text-purple-400 mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">50</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Subscribed Events</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <UsersIcon className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">3</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming CompSci Events</p>
        </div>
      </div>

      {!randomGroup ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No events are currently available. Please check back later.
        </div>
      ) : (
        randomGroup.map((group, groupIndex) => {
          const groupEvents = events.filter(event => 
            event.groups && event.groups.includes(group)
          );

          return (
            <section key={groupIndex} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {`Events in ${group}`}
                </h2>
                <Link 
                  href="/events" 
                  className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center space-x-1 text-sm font-medium"
                >
                  <span>View all</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupEvents.map((event, index) => (
                  <EventTile 
                    key={event.id || index}
                    imageUrl={event.imageUrl || "/example.jpg"}
                    title={event.name || "Event Title"}
                    description={event.description || "Event description"}
                    ticketsLeft={event.ticketsLeft || 0}
                    id={event.id}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}