import Link from 'next/link';
import EventTile from '@/components/sidebar/EventTile';

export default function Events() {
  return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 px-4">All Events</h2>
        
        <div className="flex flex-wrap gap-6 px-4">
          <EventTile 
            imageUrl="/example.jpg"
            title="Event Title 1" 
            description="Event description goes here"
            ticketsLeft={100}
          />
          <EventTile
            imageUrl="/example.jpg" 
            title="Event Title 2"
            description="Another event description"
            ticketsLeft={50}
          />
          <EventTile
            imageUrl="/example.jpg"
            title="Event Title 3"
            description="Yet another event description"
            ticketsLeft={75}
          />
        </div>

        <Link 
          href="/events/add"
          className="fixed bottom-8 left-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-8 h-8 text-white"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 4.5v15m7.5-7.5h-15" 
            />
          </svg>
        </Link>
      </div>
  );
}