"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getEvent, getTicket, createTicket } from '@/services/apiServices';
const TEST_USER_ID = "7ef177e5-17ef-4baa-940a-83ccd4bb33c7";
const TEST_USER_EMAIL = "test@example.com";


export default function EventTile({
    imageUrl = 'https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.jpg?s=612x612&w=0&k=20&c=yIKLzW7wMydqmuItTTtUGS5cYTmrRGy0rXk81AltdTA=',
    title = 'Event Title',
    description = 'Event description goes here',
    id = '1',
    groups = [],
    onTimetableToggle,
    tags = []
}) {
    const [ticketsLeft, setTicketsLeft] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get tickets left count
    useEffect(() => {
        const fetchTicketInfo = async () => {
            try {
                const eventResponse = await getEvent({
                    event_id: id,
                });
                const maxTickets = eventResponse.data.max_tick;

                try {
                    const ticketResponse = await getTicket({
                        event_id: id
                    });
                    const currentTickets = ticketResponse.data.ticket_count || 0;
                    setTicketsLeft(maxTickets - currentTickets);
                } catch (ticketError) {
                    if (ticketError.response?.status === 404) {
                        setTicketsLeft(maxTickets);
                    } else {
                        throw ticketError;
                    }
                }
            } catch (error) {
                console.error('Error fetching ticket information:', error);
                setTicketsLeft(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTicketInfo();
        }
    }, [id]);

    return (
        <Link href={`/dashboard/events/${id}`} className="block">
            <div className="group rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-lg 
                          hover:shadow-cyan-500/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 
                          hover:-translate-y-1 cursor-pointer">
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
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-sm">
                                {loading ? 'Loading...' : 
                                 ticketsLeft === null ? 'Unavailable' :
                                 `${ticketsLeft} available`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
