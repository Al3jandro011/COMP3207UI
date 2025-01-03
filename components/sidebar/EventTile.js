import Image from 'next/image';
import Link from 'next/link';

export default function EventTile({ 
    imageUrl = '/default-event.jpg',
    title = 'Event Title',
    description = 'Event description goes here',
    ticketsLeft = 100,
    id = '1'
}) {
    return (
        <div className="group rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-lg 
                      hover:shadow-cyan-500/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 
                      hover:-translate-y-1">
            <div className="h-48 w-full overflow-hidden rounded-t-xl relative">
                <Image 
                    src={imageUrl} 
                    alt={title} 
                    fill
                    className="object-cover transform transition-transform duration-300 
                             group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
            </div>
            <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {description}
                </p>
                <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span className="text-sm">
                            {ticketsLeft} available
                        </span>
                    </div>
                    <Link href={`/events/${id}`}>
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                                   text-white rounded-lg text-sm font-medium 
                                   hover:from-cyan-400 hover:to-blue-400 
                                   focus:ring-2 focus:ring-cyan-500/50 focus:outline-none
                                   transition-all duration-200">
                            View Event
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
