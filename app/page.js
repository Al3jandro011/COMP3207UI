import Link from 'next/link';
import EventTile from '@/components/sidebar/EventTile';
import { MagnifyingGlassIcon, ClockIcon, TicketIcon, UsersIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
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

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upcoming Events in ECS</h2>
          <Link 
            href="/events" 
            className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center space-x-1 text-sm font-medium"
          >
            <span>View all</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventTile 
            imageUrl="/example.jpg" 
            title="Event Title 1" 
            description="Event description 1" 
            ticketsLeft={100} 
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Computer Science Related Events</h2>
          <Link 
            href="/events" 
            className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center space-x-1 text-sm font-medium"
          >
            <span>View all</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventTile 
            imageUrl="/example.jpg" 
            title="Event Title 1" 
            description="Event description 1" 
            ticketsLeft={100} 
          />
        </div>
      </section>
    </div>
  );
}