"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HomeIcon, CalendarIcon, BuildingOfficeIcon, ChatBubbleLeftIcon, UserIcon, SunIcon, MoonIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { getAiResponse } from '@/services/apiServices';
export default function Sidebar() {
	const pathname = usePathname();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const linkClass = (path) => {
		const isActive = pathname === path || pathname.startsWith(`${path}/`);
		return `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
			isActive 
				? "bg-gradient-to-r from-cyan-500/10 to-cyan-500/20 text-cyan-400 font-medium border-r-2 border-cyan-400" 
				: "text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-white"
		}`;
	};

	const handleSendMessage = async () => {
		if (!inputMessage.trim()) return;

		const newUserMessage = {
			text: inputMessage,
			isUser: true
		};
		setMessages(prev => [...prev, newUserMessage]);
		setInputMessage('');

		try {
			const response = await getAiResponse({
				message: inputMessage
			});

			if (response && response.message) {
				const aiResponse = {
					text: response.message,
					isUser: false
				};
				setMessages(prev => [...prev, aiResponse]);
			} else {
				throw new Error('Invalid response from AI');
			}
		} catch (error) {
			console.error('Error getting AI response:', error);
			const errorResponse = {
				text: "Sorry, I'm having trouble responding right now. Please try again later.",
				isUser: false
			};
			setMessages(prev => [...prev, errorResponse]);
		}
	};

	return (
		<>
			<div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800/50 flex items-center justify-between px-4 lg:hidden z-50">
				<Link href="/" className="flex items-center space-x-2">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
						<span className="text-white font-bold text-xl">E</span>
					</div>
					<span className="text-xl font-semibold text-gray-900 dark:text-white">EVECS</span>
				</Link>
				<button 
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
				>
					{isMobileMenuOpen ? (
						<XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
					) : (
						<svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					)}
				</button>
			</div>

			<aside className={`fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800/50 transition-transform duration-300 z-40
				${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
				<div className="p-6 border-b border-gray-200 dark:border-gray-800/50">
					<Link href="/" className="flex items-center space-x-2">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
							<span className="text-white font-bold text-xl">E</span>
						</div>
						<span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight hover:text-cyan-400 transition-colors duration-200">
							EVECS
						</span>
					</Link>
				</div>
				
				{isChatOpen ? (
					<div className="flex flex-col h-[calc(100vh-88px)]">
						<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800/50">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">Assistant</h2>
							<button 
								onClick={() => setIsChatOpen(false)}
								className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
							>
								<XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
						</div>
						
						<div className="flex-1 overflow-y-auto p-4">
							{messages.map((message, index) => (
								<div key={index} className="mb-4">
									<div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
										<div className={`max-w-[80%] p-3 rounded-lg ${
											message.isUser 
												? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
												: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
										}`}>
											{message.text}
										</div>
									</div>
								</div>
							))}
						</div>
						
						<div className="p-4 border-t border-gray-200 dark:border-gray-800/50">
							<div className="flex gap-2">
								<input 
									type="text"
									value={inputMessage}
									onChange={(e) => setInputMessage(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
									placeholder="Type your message..."
									className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 
											 text-gray-900 dark:text-white border border-gray-200 
											 dark:border-gray-700 focus:outline-none focus:ring-2 
											 focus:ring-cyan-500"
								/>
								<button 
									onClick={handleSendMessage}
									className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
								>
									<PaperAirplaneIcon className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				) : (
					<>
						<nav className="px-3 py-6">
							<div className="px-4 mb-4">
								<span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
									Main Menu
								</span>
							</div>
							<ul className="space-y-1.5">
								<li>
									<Link href="/" className={linkClass("/")}>
										<HomeIcon className="w-5 h-5" />
										<span>Dashboard</span>
									</Link>
								</li>
								<li>
									<Link href="/timetable" className={linkClass("/timetable")}>
										<CalendarIcon className="w-5 h-5" />
										<span>Timetable</span>
									</Link>
								</li>
								<li>
									<Link href="/events" className={linkClass("/events")}>
										<BuildingOfficeIcon className="w-5 h-5" />
										<span>Events</span>
									</Link>
								</li>
							</ul>
						</nav>

						<div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800/50">
							<button 
								onClick={() => setIsChatOpen(true)}
								className={`w-full ${linkClass("/assistant")} hover:bg-gray-800`}
							>
								<ChatBubbleLeftIcon className="w-5 h-5" />
								<span>Assistant</span>
							</button>

							<Link href="/account" className={`${linkClass("/account")} hover:bg-gray-800`}>
								<UserIcon className="w-5 h-5" />
								<span>Account</span>
							</Link>
						</div>
					</>
				)}
			</aside>

			{isMobileMenuOpen && (
				<div 
					className="fixed inset-0 bg-gray-900/50 lg:hidden z-30"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
		</>
	);
}
