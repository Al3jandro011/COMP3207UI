"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function EventPage({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isInTimetable, setIsInTimetable] = useState(false);
  const resolvedParams = React.use(params);

  useEffect(() => {
    // Simulating API call with dummy data
    const fetchEvent = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const dummyEvent = {
          id: resolvedParams.id,
          name: "Example Event 1",
          description: "Example description 1",
          imageUrl: "/example.jpg",
          startTime: "2024-03-15T09:00:00",
          endTime: "2024-03-17T18:00:00",
          type: "non-compulsory",
          location: "Building 46, 3020",
          groups: ["COMP3200", "COMP3210", "COMP3220"],
          creatorId: "currentUserId"
        };

        setEvent(dummyEvent);
        setIsCreator(dummyEvent.creatorId === "currentUserId");
        setIsInTimetable(false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedParams.id]);

  const handleTimetableToggle = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInTimetable(!isInTimetable);
    } catch (error) {
      console.error('Error updating timetable:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/events';
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-400">Loading...</div>;
  }

  if (!event) {
    return <div className="p-6 text-gray-400">Event not found</div>;
  }

  return (
    
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
        <Image src={event.imageUrl || '/default-event-image.jpg'} alt={event.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      {/* <div className="space-x-4 flex items-center">
  <button
    onClick={() => alert("Ticket functionality coming soon!")}
    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-green-500/50 focus:outline-none"
  >
    Get Ticket
  </button>

  <button
    onClick={handleTimetableToggle}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isInTimetable
        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
    } text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}
  >
    {isInTimetable ? "Remove from Timetable" : "Add to Timetable"}
  </button>

  {isCreator && (
    <>
      <a
        href={`/events/${resolvedParams.id}/edit`}
        className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-500/50 focus:outline-none"
      >
        Edit
      </a>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
      >
        Delete
      </button>
    </>
  )}
</div> */}

      
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{event.name}</h1>
          <div className="space-x-4">
            <button onClick={handleTimetableToggle} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isInTimetable ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'} text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}>
              {isInTimetable ? 'Remove from Timetable' : 'Add to Timetable'}
            </button>
            
            {isCreator && (
              <>
                <a href={`/events/${resolvedParams.id}/edit`} className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-500/50 focus:outline-none">
                  Edit
                </a>
                <button onClick={handleDelete} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-red-500/50 focus:outline-none">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-lg text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>
              {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Type</p>
          <p className="text-gray-600 dark:text-gray-400 capitalize">{event.type}</p>
        </div>

        <div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Groups</p>
          <div className="flex flex-wrap gap-2">
            {event.groups.map((group, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 rounded-full text-sm text-gray-700 dark:text-gray-300">
                {group}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.description}</p>
        </div>

        <div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Location</p>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPinIcon className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}