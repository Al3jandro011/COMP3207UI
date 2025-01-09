"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CalendarIcon, MapPinIcon, CalendarDaysIcon, LinkIcon, TicketIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getEvent, getTicket, createTicket, deleteTicket, deleteEvent, getUserDetails, getUserIdFromEmail, updateTicket } from "@/services/apiServices";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
		`LOCATION: ${event.location_name}, Room ${event.room_id}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');

	return icsContent;
}

const ValidateModal = ({ isOpen, onClose, eventCode, ticketId, setTicketHolders, eventId, setEvent }) => {
	const [code, setCode] = useState('');
	const [isValidating, setIsValidating] = useState(false);
	const [error, setError] = useState('');

	const handleClose = () => {
		onClose();
		setCode('');
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setIsValidating(true);

		try {
			if (code === eventCode) {
				await updateTicket({
					ticket_id: ticketId,
					validated: true
				});

				const ticketResponse = await getTicket({
					event_id: eventId
				});
				setTicketHolders(ticketResponse.data.tickets || []);
				
				const currentTicket = ticketResponse.data.tickets?.find(t => t.ticket_id === ticketId);
				if (currentTicket) {
					setEvent(prev => ({
						...prev,
						validated: currentTicket.validated
					}));
				}
				
				handleClose();
			} else {
				setError('Invalid code. Please try again.');
			}
		} catch (error) {
			console.error('Error validating ticket:', error);
			setError('Failed to validate ticket. Please try again.');
		} finally {
			setIsValidating(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Validate Ticket
					</h3>
					<button
						onClick={handleClose}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
							Event Code
						</label>
						<input
							type="text"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							required
							className="w-full px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
							placeholder="Enter event code"
						/>
					</div>

					{error && (
						<p className="text-red-500 dark:text-red-400 text-sm">
							{error}
						</p>
					)}

					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isValidating}
							className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg disabled:opacity-50"
						>
							{isValidating ? 'Validating...' : 'Validate'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const CodeModal = ({ isOpen, onClose, eventCode }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Event Code
					</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>
				
				<div className="space-y-4">
					<p className="text-gray-600 dark:text-gray-400">
						Use this code to validate tickets for this event.
					</p>
					<div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
						<p className="text-2xl font-mono font-semibold text-gray-900 dark:text-gray-100">
							{eventCode}
						</p>
					</div>
				</div>

				<div className="flex justify-end pt-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
								 text-gray-900 dark:text-gray-100 rounded-lg transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

const AddTicketModal = ({ 
	isOpen, 
	onClose, 
	emailInput, 
	setEmailInput, 
	isProcessing, 
	setIsProcessing,
	resolvedParams,
	setTicketHolders 
}) => {
	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsProcessing(true);
		
		try {
			// Get user ID from email
			const response = await getUserIdFromEmail(emailInput);
			const userId = response.data.email_to_user_id[emailInput];
			
			if (!userId) {
				alert('User not found with this email');
				return;
			}

			// Create ticket for the user
			await createTicket({
				user_id: userId,
				event_id: resolvedParams.id,
				email: emailInput
			});

			// Refresh ticket holders list
			const ticketResponse = await getTicket({
				event_id: resolvedParams.id
			});
			setTicketHolders(ticketResponse.data.tickets || []);
			
			onClose();
			setEmailInput('');
		} catch (error) {
			console.error('Error creating ticket:', error);
			alert(error.response?.data?.error || 'Failed to create ticket');
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Add Ticket for User
					</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
							User Email
						</label>
						<input
							type="email"
							value={emailInput}
							onChange={(e) => setEmailInput(e.target.value)}
							required
							className="w-full px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
							placeholder="Enter user email"
						/>
					</div>

					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isProcessing}
							className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg disabled:opacity-50"
						>
							{isProcessing ? 'Adding...' : 'Add Ticket'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default function EventPage({ params }) {
	const router = useRouter();
	const { user, loading: authLoading } = useAuth();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isCreator, setIsCreator] = useState(false);
	const [isInTimetable, setIsInTimetable] = useState(false);
	const [ticketsLeft, setTicketsLeft] = useState(null);
	const [isCreatingTicket, setIsCreatingTicket] = useState(false);
	const [ticketId, setTicketId] = useState(null);
	const [ticketHolders, setTicketHolders] = useState([]);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
	const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
	const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
	const [emailInput, setEmailInput] = useState('');
	const [isProcessing, setIsProcessing] = useState(false);
	const resolvedParams = React.use(params);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				if (!user) return;

				const [eventResponse, userResponse] = await Promise.all([
					getEvent({ event_id: resolvedParams.id }),
					getUserDetails({ user_id: user.id })
				]);

				const eventData = eventResponse.data;
				console.log('Event data:', eventData);

				setEvent(eventData);
				setIsCreator(true);
				
				setIsAuthorized(userResponse.data.user.auth || false);

				try {
					const ticketResponse = await getTicket({
						event_id: resolvedParams.id,
						user_id: user.id
					});

					if (ticketResponse.data.subscribed) {
						setIsInTimetable(true);
						setTicketId(ticketResponse.data.ticket.ticket_id);
						setEvent(prev => ({
							...prev,
							validated: ticketResponse.data.ticket.validated
						}));
					} else {
						setIsInTimetable(false);
						setTicketId(null);
					}

				} catch (error) {
					console.log('No ticket found:', error);
					setIsInTimetable(false);
					setTicketId(null);
				}

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

		if (!authLoading) {
			fetchEvent();
		}
	}, [resolvedParams.id, user, authLoading]);

	useEffect(() => {
		const fetchTicketHolders = async () => {
			try {
				const response = await getTicket({
					event_id: resolvedParams.id
				});
				
				setTicketHolders(response.data.tickets || []);
			} catch (error) {
				console.error('Error fetching ticket holders:', error);
			}
		};

		fetchTicketHolders();
	}, [resolvedParams.id]);

	const handleTimetableToggle = async () => {
		if (isCreatingTicket) return;

		try {
			setIsCreatingTicket(true);

			if (!isInTimetable) {
				const response = await createTicket({
					user_id: user?.id,
					event_id: resolvedParams.id,
					email: user?.email
				});

				if (response.data.result === "success") {
					setIsInTimetable(true);
					setTicketId(response.data.ticket_id);
					setTicketsLeft(prev => prev !== null ? prev - 1 : null);
				}
			} else {
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
					user_id: user?.id,
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
			<ValidateModal 
				isOpen={isValidateModalOpen} 
				onClose={() => setIsValidateModalOpen(false)}
				eventCode={event?.code}
				ticketId={ticketId}
				setTicketHolders={setTicketHolders}
				eventId={resolvedParams.id}
				setEvent={setEvent}
			/>
			<CodeModal 
				isOpen={isCodeModalOpen} 
				onClose={() => setIsCodeModalOpen(false)}
				eventCode={event?.code || 'No code available'} 
			/>
			<AddTicketModal 
				isOpen={isAddTicketModalOpen} 
				onClose={() => {
					setIsAddTicketModalOpen(false);
					setEmailInput('');
				}}
				emailInput={emailInput}
				setEmailInput={setEmailInput}
				isProcessing={isProcessing}
				setIsProcessing={setIsProcessing}
				resolvedParams={resolvedParams}
				setTicketHolders={setTicketHolders}
			/>

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
									? event.tags.includes('Compulsory') 
										? "hidden"
										: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
									: ticketsLeft === 0
										? "bg-gray-400 cursor-not-allowed"
										: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
							} text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}
						>
							{isCreatingTicket ? 'Processing...' : 
								isInTimetable 
									? event.tags.includes('Compulsory') 
										? null 
										: "Remove" 
									: ticketsLeft === 0 
										? 'Sold Out' 
										: "Add to Timetable"}
						</button>

						{isInTimetable && !isAuthorized && !event.validated && (
							<button
								onClick={() => setIsValidateModalOpen(true)}
								className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 
									 hover:to-indigo-400 text-white rounded-lg font-medium transition-all duration-200 
									 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
							>
								Validate Ticket
							</button>
						)}

						{isAuthorized && (
							<>
								<Link
									href={`/dashboard/events/${resolvedParams.id}/edit`}
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
							</>
						)}

						{isAuthorized && (
							<button
								onClick={() => setIsCodeModalOpen(true)}
								className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 
										 hover:to-teal-400 text-white rounded-lg font-medium transition-all duration-200 
										 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
							>
								Show Code
							</button>
						)}
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
					<div className="flex flex-wrap gap-2">
						{event.groups.map((group, index) => (
							<span key={index} className="px-3 py-1 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 
											 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 
											 rounded-full text-sm text-gray-700 dark:text-gray-300">
								{group}
							</span>
						))}
					</div>
				</div>

				<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
					<p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
					<p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.desc}</p>
				</div>

				<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
					<p className="font-semibold text-gray-900 dark:text-gray-100">Location</p>
					<div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
						<MapPinIcon className="w-5 h-5" />
						<span>{event.location_name}, Room {event.room_id}</span>
					</div>
					<MapComponent id={event.location_id} />
				</div>

				{isAuthorized && (
					<div className="space-y-2 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
						<div className="flex justify-between items-center mb-4">
							<p className="font-semibold text-gray-900 dark:text-gray-100">Users</p>
							{event.tags.includes('Compulsory') && (
								<button
									onClick={() => setIsAddTicketModalOpen(true)}
									className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm"
								>
									Add User
								</button>
							)}
						</div>
						{ticketHolders.length === 0 ? (
							<p className="text-gray-600 dark:text-gray-400">No users have tickets for this event yet.</p>
						) : (
							<div className="space-y-3">
								{ticketHolders.map((ticket) => (
									<div 
										key={ticket.ticket_id}
										className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 
												 rounded-lg border border-gray-200 dark:border-gray-600"
									>
										<div className="flex items-center space-x-3">
											<div className="w-2 h-2 rounded-full bg-gradient-to-r 
													 from-cyan-500 to-blue-500" />
											<span className="text-gray-700 dark:text-gray-300">
												{ticket.email}
											</span>
										</div>
										<span className={`px-2 py-1 text-xs rounded-full ${
											ticket.validated
												? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
												: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
										}`}>
											{ticket.validated ? 'Validated' : 'Not Validated'}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
