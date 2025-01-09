'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';
import { getUserTickets, getEvent, getValidGroups } from '@/services/apiServices';
import { useRouter } from 'next/navigation';
import EventTile from '@/components/EventTile';
import { useAuth } from '@/contexts/AuthContext';

const Select = dynamic(() => import('react-select'), {
  ssr: false
});

export default function Timetable() {
  const router = useRouter();

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const [compulsory, setCompulsory] = useState({ value: 'all', label: 'All' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(startOfYear);
  const [endDate, setEndDate] = useState(endOfYear);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarLinked, setIsCalendarLinked] = useState(false);
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false);
  const [isOutlookLinked, setIsOutlookLinked] = useState(false);
  const [timetableStatus, setTimetableStatus] = useState({});
	const { user, loading: authLoading } = useAuth();
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    searchEvents();
  }, []);

  useEffect(() => {
    const loadGoogleApi = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          console.log('Google API script loaded');
          resolve();
        };
        script.onerror = (error) => {
          console.error('Error loading Google API script:', error);
          reject(error);
        };
        document.body.appendChild(script);
      });
    };

    const initializeGoogleApi = async () => {
      try {
        await new Promise((resolve) => window.gapi.load('client:auth2', resolve));
        
        await window.gapi.client.init({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        });

        console.log('Google API initialized successfully');
        setIsGoogleApiReady(true);
      } catch (error) {
        console.error('Error initializing Google API:', error);
        throw error;
      }
    };

    const initialize = async () => {
      try {
        if (!window.gapi) {
          await loadGoogleApi();
        }
        await initializeGoogleApi();
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
      }
    };

    initialize();

    return () => {
      if (window.gapi?.auth2) {
        const auth2 = window.gapi.auth2.getAuthInstance();
        if (auth2) {
          auth2.signOut();
        }
      }
    };
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getValidGroups();
        const groupOptions = response.data.groups.map(group => ({
          value: group,
          label: group
        }));
        setAvailableGroups(groupOptions);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const filterEvents = (events) => {
    return events.filter(event => {
        if (compulsory.value !== 'all') {
            const isCompulsory = event.tags?.includes('Compulsory');
            if (compulsory.value === 'yes' && !isCompulsory) return false;
            if (compulsory.value === 'no' && isCompulsory) return false;
        }

        if (selectedTags.length > 0) {
            const eventGroups = event.groups || [];
            const hasMatchingGroup = selectedTags.some(tag => 
                eventGroups.includes(tag.value)
            );
            if (!hasMatchingGroup) return false;
        }

        const eventStart = new Date(event.start_date);
        const eventEnd = new Date(event.end_date);
        
        if (eventEnd < startDate || eventStart > endDate) {
            return false;
        }

        return true;
    });
  };

  const searchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const testUserId = user?.id;
      const ticketsResponse = await getUserTickets(testUserId);
      console.log('Tickets Response:', ticketsResponse.data);
      
      const userEventIds = ticketsResponse.data.subscriptions?.map(sub => sub.event_id) || [];
      console.log('User event IDs:', userEventIds);

      if (userEventIds.length === 0) {
        setEvents([]);
        return;
      }

        const eventPromises = userEventIds.map(eventId => 
            getEvent({ event_id: eventId })
        );

        const eventResponses = await Promise.all(eventPromises);
        const allEvents = eventResponses.map(response => response.data)
            .filter(Boolean); // Filter out any null/undefined events

        const filteredEvents = filterEvents(allEvents);
        
        console.log('All Events:', allEvents);
        console.log('Filtered Events:', filteredEvents);
        setEvents(filteredEvents);
        
    } catch (err) {
        console.error('Error in searchEvents:', err);
        setError('Failed to load events. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  const compulsoryOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'all', label: 'All' }
  ];

  const availableTags = availableGroups;

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

  const handleLinkCalendar = async () => {
    try {
      if (!window.gapi?.auth2) {
        throw new Error('Google API not initialized properly');
      }

      const auth2 = window.gapi.auth2.getAuthInstance();
      if (!auth2) {
        throw new Error('Auth instance not found');
      }

      const user = await auth2.signIn({
        scope: 'https://www.googleapis.com/auth/calendar'
      });

      if (!user) {
        throw new Error('Failed to sign in user');
      }

      const authResponse = user.getAuthResponse();
      if (!authResponse) {
        throw new Error('No auth response received');
      }

      try {
        const response = await window.gapi.client.calendar.calendarList.list();
        console.log('Calendar access successful:', response.result);
        setIsCalendarLinked(true);
        console.log('Calendar successfully linked!');
      } catch (calendarError) {
        console.error('Calendar access failed:', calendarError);
        throw new Error('Failed to access calendar');
      }
    } catch (error) {
      console.error('Error linking calendar:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setIsCalendarLinked(false);
      alert(error.message || 'Failed to link Google Calendar. Please try again.');
    }
  };

  const handleLinkOutlook = async () => {
    try {
        const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
        
        // Create a list of events to add to the calendar
        const eventsToAdd = events.map(event => {
            const start = new Date(event.start_date || event.startTime);
            const end = new Date(event.end_date || event.endTime);
            return {
                subject: event.name,
                start: start.toISOString(),
                end: end.toISOString(),
                body: event.desc || '',
                location: event.location || ''
            };
        });

        // Construct the URL for adding multiple events
        const params = eventsToAdd.map(event => {
            return `subject=${encodeURIComponent(event.subject)}&startdt=${event.start}&enddt=${event.end}&body=${encodeURIComponent(event.body)}&location=${encodeURIComponent(event.location)}`;
        }).join('&');

        outlookUrl.search = params;

        const width = 800;
        const height = 600;
        const left = (window.innerWidth - width) / 2 + window.screenX;
        const top = (window.innerHeight - height) / 2 + window.screenY;

        const popup = window.open(
            outlookUrl.toString(),
            'OutlookCalendar',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );

        if (popup) {
            setIsOutlookLinked(true);
            localStorage.setItem('outlookLinked', 'true');
            console.log('Outlook calendar linked successfully');
        } else {
            throw new Error('Popup was blocked. Please allow popups for this site.');
        }
    } catch (error) {
        console.error('Error linking Outlook:', error.message);
        setIsOutlookLinked(false);
        localStorage.removeItem('outlookLinked');
        alert(error.message || 'Failed to link Outlook. Please try again.');
    }
  };

  const addEventToOutlook = (event) => {
    if (!isOutlookLinked) {
      console.log('Outlook calendar not linked');
      return;
    }

    try {
      const start = new Date(event.start_date || event.startTime);
      const end = new Date(event.end_date || event.endTime);

      const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
      
      const params = new URLSearchParams({
        subject: event.name,
        startdt: start.toISOString(),
        enddt: end.toISOString(),
        body: event.desc || '',
        location: event.location || ''
      });

      outlookUrl.search = params.toString();

      window.open(
        outlookUrl.toString(),
        'AddToOutlook',
        `width=800,height=600,left=${(window.innerWidth - 800) / 2},top=${(window.innerHeight - 600) / 2},scrollbars=yes`
      );
    } catch (error) {
      console.error('Error adding event to Outlook:', error);
    }
  };

  useEffect(() => {
    const linkedStatus = localStorage.getItem('outlookLinked');
    if (linkedStatus === 'true') {
      setIsOutlookLinked(true);
    }
  }, []);

  const handleTimetableToggle = async (eventId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTimetableStatus(prev => ({
        ...prev,
        [eventId]: !prev[eventId]
      }));

      if (!timetableStatus[eventId] && isOutlookLinked) {
        const event = events.find(e => e.event_id === eventId);
        if (event) {
          addEventToOutlook(event);
        }
      }
    } catch (error) {
      console.error('Error updating timetable:', error);
    }
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
              <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Time Interval</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">From</label>
                  <input
                    type="datetime-local"
                    value={startDate.toISOString().slice(0, 16)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">To</label>
                  <input
                    type="datetime-local"
                    value={endDate.toISOString().slice(0, 16)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
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
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">Add Group</span>
              </button>
              
              {isTagDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700/50 z-10">
                  <div className="max-h-[200px] overflow-y-auto">
                    {availableGroups
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

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={searchEvents}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search Events'}
          </button>
          
          {/* <button
            onClick={handleLinkOutlook}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none flex items-center justify-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="whitespace-nowrap">
                Link All Events to Outlook
            </span>
          </button> */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventTile 
                key={event.event_id}
                id={event.event_id}
                imageUrl={event.imageUrl || "/example.jpg"}
                title={event.name}
                description={event.desc}
                onTimetableToggle={(eventId) => handleTimetableToggle(eventId)}
                tags={event.tags}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
