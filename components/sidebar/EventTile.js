import Image from 'next/image';

export default function EventTile({ 
    imageUrl = '/default-event.jpg',
    title = 'Event Title',
    description = 'Event description goes here',
    ticketsLeft = 100
}) {
    return (
        <div className="w-[280px] rounded-xl bg-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
            <div className="h-40 w-full overflow-hidden rounded-t-xl relative">
                <Image 
                    src={imageUrl} 
                    alt={title} 
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {description}
                </p>
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">
                        {ticketsLeft} tickets left
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Get Now
                    </button>
                </div>
            </div>
        </div>
    );
}
