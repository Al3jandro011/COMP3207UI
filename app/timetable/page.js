'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { makeCalendar } from '@/services/apiServices';

const Select = dynamic(() => import('react-select'), {
  ssr: false
});

export default function Timetable() {
  // Set default dates (today and 1 month from today)
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const [compulsory, setCompulsory] = useState({ value: 'all', label: 'All' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextMonth);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load events on initial render
  useEffect(() => {
    searchEvents();
  }, []);

  const searchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = [
        compulsory.value !== 'all' ? `compulsory=${compulsory.value}` : null,
        ...selectedTags.map(tag => tag.value)
      ].filter(Boolean);

      const response = await makeCalendar({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        filters: filters
      });

      setEvents(response.data.results || []);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const compulsoryOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'all', label: 'All' }
  ];

  const availableTags = [
    { value: 'comp3200', label: 'COMP3200' },
    { value: 'comp3227', label: 'COMP3227' },
    { value: 'comp3228', label: 'COMP3228' },
    { value: 'comp3229', label: 'COMP3229' },
    { value: 'comp3230', label: 'COMP3230' },
    { value: 'comp3231', label: 'COMP3231' },
    { value: 'comp3232', label: 'COMP3232' },
    { value: 'comp3233', label: 'COMP3233' },
    { value: 'comp3234', label: 'COMP3234' },
    { value: 'comp3235', label: 'COMP3235' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'tabletennis', label: 'Table Tennis' },
    { value: 'chess', label: 'Chess' }
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgb(31 41 55 / 0.5)',
      borderColor: state.isFocused ? '#22d3ee' : 'rgb(55 65 81 / 0.5)',
      boxShadow: state.isFocused ? '0 0 0 1px #22d3ee' : 'none',
      '&:hover': {
        borderColor: '#22d3ee'
      }
    }),
    menu: (base) => ({
      ...base,
      background: 'rgb(31 41 55)',
      border: '1px solid rgb(55 65 81 / 0.5)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgb(55 65 81)' : 'transparent',
      color: 'rgb(209 213 219)',
      '&:hover': {
        backgroundColor: 'rgb(55 65 81)',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: 'rgb(209 213 219)'
    }),
    input: (base) => ({
      ...base,
      color: 'rgb(209 213 219)'
    })
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.value !== tagToRemove.value));
  };

  const addTag = (newTag) => {
    if (newTag && !selectedTags.find(tag => tag.value === newTag.value)) {
      setSelectedTags([...selectedTags, newTag]);
    }
    setIsTagDropdownOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Timetable</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your event schedule</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Compulsory Events:</label>
              <Select 
                value={compulsory} 
                onChange={setCompulsory} 
                options={compulsoryOptions} 
                className="w-full" 
                styles={customSelectStyles} 
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Date Range:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg p-2.5 w-full focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    min={startDate.toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg p-2.5 w-full focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Groups:</label>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {selectedTags.map((tag) => (
                <div key={tag.value} className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  {tag.label}
                  <button onClick={() => removeTag(tag)} className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 transition-colors">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)} 
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Group</span>
              </button>
              
              {isTagDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700/50 z-10">
                  <div className="max-h-[200px] overflow-y-auto">
                    {availableTags
                      .filter(tag => !selectedTags.find(t => t.value === tag.value))
                      .map(tag => (
                        <div 
                          key={tag.value} 
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150" 
                          onClick={() => addTag(tag)}
                        >
                          {tag.label}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search button */}
        <div className="mt-6 flex justify-start">
          <button
            onClick={searchEvents}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search Events'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
        {error ? (
          <div className="text-red-500 dark:text-red-400 text-center py-8">{error}</div>
        ) : isLoading ? (
          <div className="text-gray-600 dark:text-gray-400 text-center py-8">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400 text-center py-8">No events to show</div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.event_id} 
                className="p-4 border border-gray-200 dark:border-gray-700/50 rounded-lg"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{event.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{event.desc}</p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.start_date).toLocaleString()} - {new Date(event.end_date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
