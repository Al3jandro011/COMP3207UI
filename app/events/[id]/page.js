"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CalendarIcon, MapPinIcon, CalendarDaysIcon, LinkIcon, TicketIcon } from "@heroicons/react/24/outline";
import { getEvent, getTicket, createTicket, deleteTicket } from "@/services/apiServices";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';

const MapComponent = dynamic(() => import("@/components/maps/GoogleMap"), {
	ssr: false,
	loading: () => (
		<div className="h-[300px] bg-gray-800/50 rounded-xl animate-pulse" />
	),
});

function generateICSFile(event) {
	const startDate = new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	const endDate = new Date(event.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	
	const icsContent = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'BEGIN:VEVENT',
		`DTSTART:${startDate}`,
		`DTEND:${endDate}`,
		`SUMMARY:${event.name}`,
		`DESCRIPTION:${event.desc}`,
		`LOCATION:${event.room_id}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');

	return icsContent;
}

export default function EventPage({ params }) {
	const router = useRouter();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isCreator, setIsCreator] = useState(false);
	const [isInTimetable, setIsInTimetable] = useState(false);
	const [ticketsLeft, setTicketsLeft] = useState(null);
	const [isCreatingTicket, setIsCreatingTicket] = useState(false);
	const [ticketId, setTicketId] = useState(null);
	const resolvedParams = React.use(params);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const data = {
					event_id: resolvedParams.id,
				};

				const response = await getEvent(data);
				const eventData = response.data;
				console.log('Event data:', eventData);

				setEvent(eventData);
				setIsCreator(true);

				// Check if user has a ticket
				try {
					console.log('Checking ticket for user...');
					const ticketResponse = await getTicket({
						event_id: resolvedParams.id,
						user_id: "6f94e0c5-4ff4-456e-bba4-bfd3d665059b"
					});
					console.log('Ticket response:', ticketResponse.data);
					
					// Find the ticket for this event
					const ticket = ticketResponse.data.tickets?.find(
						ticket => ticket.event_id === resolvedParams.id
					);

					if (ticket) {
						setIsInTimetable(true);
						setTicketId(ticket.ticket_id); // Store the ticket ID
						console.log('Found ticket:', ticket);
					} else {
						setIsInTimetable(false);
						setTicketId(null);
					}

				} catch (error) {
					console.log('No ticket found:', error);
					setIsInTimetable(false);
					setTicketId(null);
				}

				// Get total tickets count
				try {
					const ticketCountResponse = await getTicket({
						event_id: resolvedParams.id
					});
					const currentTickets = ticketCountResponse.data.ticket_count || 0;
					setTicketsLeft(eventData.max_tick - currentTickets);
				} catch (ticketError) {
					if (ticketError.response?.status === 404) {
						setTicketsLeft(eventData.max_tick);
					}
				}

				setLoading(false);
			} catch (error) {
				console.error('Error fetching event:', error);
				setLoading(false);
			}
		};

		fetchEvent();
	}, [resolvedParams.id]);

	const handleTimetableToggle = async () => {
		if (isCreatingTicket) return;

		try {
			setIsCreatingTicket(true);

			if (!isInTimetable) {
				// Create ticket
				const response = await createTicket({
					user_id: "6f94e0c5-4ff4-456e-bba4-bfd3d665059b",
					event_id: resolvedParams.id,
					email: "test@example.com"
				});

				if (response.data.result === "success") {
					setIsInTimetable(true);
					setTicketId(response.data.ticket_id); // Store the new ticket ID
					setTicketsLeft(prev => prev !== null ? prev - 1 : null);
				}
			} else {
				// Delete ticket using ticket_id
				if (!ticketId) {
					throw new Error('No ticket ID found for deletion');
				}
				
				await deleteTicket({
					ticket_id: ticketId
				});
				
				setIsInTimetable(false);
				setTicketId(null);
				setTicketsLeft(prev => prev !== null ? prev + 1 : null);
			}
		} catch (error) {
			console.error('Error toggling ticket:', error);
				alert(error.response?.data?.error || 'Failed to update ticket');
		} finally {
			setIsCreatingTicket(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			try {
				await deleteEvent({ 
					event_id: resolvedParams.id 
				});
				router.push("/events");
			} catch (error) {
				console.error("Error deleting event:", error);
				alert('Failed to delete event. Please try again.');
			}
		}
	};

	const handleAddToCalendar = () => {
		const icsContent = generateICSFile(event);
		const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute('download', `${event.name}.ics`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (loading) {
		return <div className="p-6 text-gray-400">Loading...</div>;
	}

	if (!event) {
		return <div className="p-6 text-gray-400">Event not found</div>;
	}

	return (
		<div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-3">
			<div className="relative w-full h-[250px] sm:h-[400px] rounded-2xl overflow-hidden">
				<Image
					src={event.img_url || "/example.jpg"}
					alt={event.name}
					fill
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
			</div>

			<div className="space-y-3">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
						{event.name}
					</h1>
					<div className="flex flex-wrap gap-2 sm:gap-4">
						<button
							onClick={handleAddToCalendar}
							className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
						>
							<div className="flex items-center gap-2">
								<CalendarDaysIcon className="w-5 h-5" />
								<span>Add to Calendar</span>
							</div>
						</button>
						<button
							onClick={handleTimetableToggle}
							disabled={isCreatingTicket || (ticketsLeft === 0 && !isInTimetable)}
							className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
								isInTimetable
									? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
									: ticketsLeft === 0
										? "bg-gray-400 cursor-not-allowed"
										: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
							} text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}
						>
							{isCreatingTicket ? 'Processing...' : 
								isInTimetable ? "Remove" : 
								ticketsLeft === 0 ? 'Sold Out' : "Add to Timetable"}
						</button>

						<Link
							href={`/events/${resolvedParams.id}/edit`}
							className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-500/50 focus:outline-none"
						>
							Edit
						</Link>
						<button
							onClick={handleDelete}
							className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
						>
							Delete
						</button>
					</div>
				</div>

				<div className="text-lg text-gray-600 dark:text-gray-400">
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
						<div className="flex items-center space-x-2">
							<CalendarIcon className="w-5 h-5" />
							<span>
								{new Date(event.start_date).toLocaleString()} -{" "}
								{new Date(event.end_date).toLocaleString()}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<TicketIcon className="w-5 h-5" />
							<span>
								{ticketsLeft === null ? 'Ticket information unavailable' : 
									`${ticketsLeft} tickets available`}
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
					<p className="font-semibold text-gray-900 dark:text-gray-100">Type</p>
					<div className="flex flex-wrap gap-2">
						{event.tags.map((tag, index) => (
							<span key={index} className="px-3 py-1 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 
											 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 
											 rounded-full text-sm text-gray-700 dark:text-gray-300">
								{tag}
							</span>
						))}
					</div>
				</div>

				<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
					<p className="font-semibold text-gray-900 dark:text-gray-100">Group</p>
					<p className="text-gray-600 dark:text-gray-400">{event.group}</p>
				</div>

				<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
					<p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
					<p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.desc}</p>
				</div>

				<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
					<p className="font-semibold text-gray-900 dark:text-gray-100">Location</p>
					<div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
						<MapPinIcon className="w-5 h-5" />
						<span>Room {event.room_id}</span>
					</div>
					<MapComponent id={event.location_id} />
				</div>
			</div>
		</div>
	);
}
