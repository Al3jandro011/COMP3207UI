"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function EventPage({ params }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreator, setIsCreator] = useState(false);
    const [isInTimetable, setIsInTimetable] = useState(false);
    const resolvedParams = React.use(params);

    useEffect(() => {
        // Simulating API call with dummy data
        const fetchEvent = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const dummyEvent = {
                    id: resolvedParams.id,
                    name: "Sample Conference 2024",
                    description: "Join us for an exciting conference featuring industry experts and innovative discussions.\n\nThis multi-day event will cover various topics including technology, business, and personal development.",
                    imageUrl: "/example.jpg",
                    startTime: "2024-03-15T09:00:00",
                    endTime: "2024-03-17T18:00:00",
                    type: "non-compulsory",
                    location: "Grand Conference Center, Level 2",
                    groups: ["Technology", "Business", "Professional Development"],
                    creatorId: "currentUserId"
                };

                setEvent(dummyEvent);
                setIsCreator(dummyEvent.creatorId === "currentUserId");
                setIsInTimetable(false);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [resolvedParams.id]);

    const handleTimetableToggle = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsInTimetable(!isInTimetable);
        } catch (error) {
            console.error('Error updating timetable:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = '/events';
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!event) {
        return <div className="p-6">Event not found</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="relative w-full h-[400px]">
                <Image
                    src={event.imageUrl || '/default-event-image.jpg'}
                    alt={event.name}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-bold">{event.name}</h1>
                    <div className="space-x-4">
                        <button
                            onClick={handleTimetableToggle}
                            className={`px-4 py-2 rounded-lg ${
                                isInTimetable 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                        >
                            {isInTimetable ? 'Remove from Timetable' : 'Add to Timetable'}
                        </button>
                        
                        {isCreator && (
                            <>
                                <a
                                    href={`/events/${resolvedParams.id}/edit`}
                                    className="inline-block px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                >
                                    Edit
                                </a>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="text-lg text-gray-600">
                    <p>
                        {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Type:</p>
                    <p className="text-gray-600">{event.type}</p>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Groups:</p>
                    <div className="flex flex-wrap gap-2">
                        {event.groups.map((group, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                            >
                                {group}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Description:</p>
                    <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Location:</p>
                    <p className="text-gray-600">{event.location}</p>
                </div>
            </div>
        </div>
    );
}