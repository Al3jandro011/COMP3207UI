import Link from 'next/link';
import EventTile from '@/components/sidebar/EventTile';
export default function Home() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <input 
          type="text" 
          placeholder="Search events..." 
          className="w-full mr-4 p-2 border rounded-lg text-black"
        />
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Events in ECS</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            See all
          </Link>
        </div>
        <hr className="mb-4" />
        <EventTile imageUrl="/example.jpg" title="Event Title" description="Event description goes here" ticketsLeft={100} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Computer Science Related Events</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            See all
          </Link>
        </div>
        <hr className="mb-4" />
      </section>
    </div>
  );
}