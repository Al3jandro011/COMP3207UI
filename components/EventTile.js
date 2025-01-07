"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getEvent, getTicket, createTicket } from '@/services/apiServices';

export default function EventTile({
    imageUrl = 'https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.jpg?s=612x612&w=0&k=20&c=yIKLzW7wMydqmuItTTtUGS5cYTmrRGy0rXk81AltdTA=',
    title = 'Event Title',
    description = 'Event description goes here',
    id = '1',
    groups = [],
    onTimetableToggle
}) {
    const [ticketsLeft, setTicketsLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInTimetable, setIsInTimetable] = useState(false);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    // Check if user already has a ticket
    useEffect(() => {
        const checkTicket = async () => {
            try {
                const ticketResponse = await getTicket({
                    event_id: id,
                    user_id: "6f94e0c5-4ff4-456e-bba4-bfd3d665059b"
                });
                setIsInTimetable(!!ticketResponse.data.ticket_id);
            } catch (error) {
                setIsInTimetable(false);
            }
        };

        checkTicket();
    }, [id]);

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

    const handleTimetableToggle = async (e) => {
        e.preventDefault();
        if (isCreatingTicket) return;

        try {
            setIsCreatingTicket(true);

            if (!isInTimetable) {
                // Create ticket
                const response = await createTicket({
                    user_id: "6f94e0c5-4ff4-456e-bba4-bfd3d665059b",
                    event_id: id,
                    email: "test@example.com" // You might want to get this from user context/profile
                });

                if (response.data.result === "success") {
                    setIsInTimetable(true);
                    // Update tickets left count
                    setTicketsLeft(prev => prev !== null ? prev - 1 : null);
                    if (onTimetableToggle) {
                        onTimetableToggle(id);
                    }
                }
            } else {
                // Handle remove from timetable if needed
                setIsInTimetable(false);
                setTicketsLeft(prev => prev !== null ? prev + 1 : null);
                if (onTimetableToggle) {
                    onTimetableToggle(id);
                }
            }
        } catch (error) {
            console.error('Error toggling ticket:', error);
            alert(error.response?.data?.error || 'Failed to update ticket');
        } finally {
            setIsCreatingTicket(false);
        }
    };

    return (
        <Link href={`/events/${id}`} className="block">
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
                        <button
                            onClick={handleTimetableToggle}
                            disabled={isCreatingTicket || (ticketsLeft === 0 && !isInTimetable)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isInTimetable 
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500' 
                                    : ticketsLeft === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                            } text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}
                        >
                            {isCreatingTicket ? 'Processing...' : 
                             isInTimetable ? 'Remove' : 
                             ticketsLeft === 0 ? 'Sold Out' : 'Add to Timetable'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
