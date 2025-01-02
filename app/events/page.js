import Link from 'next/link';

export default function Events() {
    return (
        <div className="relative min-h-screen">
            <h1>All Events</h1>
            
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