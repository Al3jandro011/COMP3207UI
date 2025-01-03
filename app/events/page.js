import Link from 'next/link';
import EventTile from '@/components/sidebar/EventTile';

export default function Events() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
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
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl 
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500
                       focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
            <svg 
              className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventTile 
            imageUrl="/example.jpg"
            title="Event Title 1" 
            description="Event description 1" 
            ticketsLeft={100}
            id="1"
          />
          <EventTile
            imageUrl="/example.jpg" 
            title="Event Title 2"
            description="Event description 2"
            ticketsLeft={50}
            id="2"
          />
          <EventTile
            imageUrl="/example.jpg"
            title="Event Title 3"
            description="Event description 3"
            ticketsLeft={75}
            id="3"
          />
        </div>

        <Link 
          href="/events/add"
          className="fixed bottom-8 right-8 px-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                   rounded-full flex items-center justify-center shadow-lg 
                   hover:from-cyan-400 hover:to-blue-400 transition-all duration-200
                   focus:ring-2 focus:ring-cyan-500/50 focus:outline-none
                   group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 4.5v15m7.5-7.5h-15" 
            />
          </svg>
          <span className="ml-2 text-white font-medium">Add Event</span>
        </Link>
      </div>
    </div>
  );
}