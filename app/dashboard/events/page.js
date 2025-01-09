"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventTile from '@/components/EventTile';
import { MagnifyingGlassIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getAllEvents, getValidGroups } from '@/services/apiServices';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchField, setSearchField] = useState('all');
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, groupsResponse] = await Promise.all([
          getAllEvents(),
          getValidGroups()
        ]);
        
        setEvents(eventsResponse.data?.events || []);
        setAvailableGroups(groupsResponse.data?.groups || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdvancedSearch = (field, value) => {
    setSearchTerm(`${field}: ${value}`);
    setIsAdvancedSearchOpen(false);
  };

  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;
    
    const [field, value] = searchTerm.split(': ');
    if (!value) {
      const searchLower = searchTerm.toLowerCase();
      return (
        event.name?.toLowerCase().includes(searchLower) ||
        event.desc?.toLowerCase().includes(searchLower) ||
        event.groups?.some(group => group.toLowerCase().includes(searchLower)) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    const searchLower = value.toLowerCase();
    switch (field.toLowerCase()) {
      case 'group':
        return event.groups?.some(group => 
          group.toLowerCase() === searchLower
        );
      case 'description':
        return event.desc?.toLowerCase().includes(searchLower);
      case 'type':
        return event.tags?.some(tag => 
          tag.toLowerCase() === searchLower
        );
      default:
        return true;
    }
  });

  if (loading) {
    return <div className="p-4 sm:p-8 text-gray-600 dark:text-gray-400">Loading events...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">All Events</h1>
      </div>

      <div className="relative mb-8">
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 pr-12 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl 
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <button
            onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 
                      hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isAdvancedSearchOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Search Dropdown */}
        {isAdvancedSearchOpen && (
          <div className="absolute mt-2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 
                       dark:border-gray-700 p-4 space-y-4 z-30">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Search by:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSearchField('group')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    searchField === 'group' 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Group
                </button>
                <button
                  onClick={() => setSearchField('description')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    searchField === 'description'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setSearchField('type')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    searchField === 'type'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Type
                </button>
              </div>
            </div>

            {searchField === 'group' && (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-600 dark:text-gray-400">Select Group:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => handleAdvancedSearch('group', group)}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                               dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 
                               transition-colors truncate"
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchField === 'type' && (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-600 dark:text-gray-400">Select Type:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAdvancedSearch('type', 'lecture')}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                             dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 
                             transition-colors"
                  >
                    Lecture
                  </button>
                  <button
                    onClick={() => handleAdvancedSearch('type', 'sports')}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                             dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 
                             transition-colors"
                  >
                    Sports
                  </button>
                </div>
              </div>
            )}

            {searchField === 'description' && (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-600 dark:text-gray-400">Enter Description:</h4>
                <input
                  type="text"
                  placeholder="Enter keywords..."
                  className="w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 
                           dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAdvancedSearch('description', e.target.value);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {error ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          Failed to load events. Please try again later.
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
              title={event.name || 'Untitled Event'}
              description={event.desc || 'No description available'}
            />
          ))}
        </div>
      )}

      <Link 
        href="/dashboard/events/add" 
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 px-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                  rounded-full flex items-center justify-center shadow-lg hover:from-cyan-400 hover:to-blue-400 
                  transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none group z-20"
      >
        <PlusIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        <span className="ml-2 text-white font-medium hidden sm:inline">Add Event</span>
      </Link>
    </div>
  );
}