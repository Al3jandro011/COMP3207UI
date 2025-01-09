"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { HomeIcon, CalendarIcon, BuildingOfficeIcon, UserIcon, SunIcon, MoonIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const linkClass = (path) => {
		const isActive = pathname === path;
		return `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
			isActive 
				? "bg-gradient-to-r from-cyan-500/10 to-cyan-500/20 text-cyan-400 font-medium border-r-2 border-cyan-400" 
				: "text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-white"
		}`;
	};

	const handleNavigation = (path) => {
		router.push(path);
	};

	const handleLinkClick = () => {
		if (window.innerWidth < 1024) { // lg breakpoint is 1024px
			setIsMobileMenuOpen(false);
		}
	};

	return (
		<>
			<div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800/50 flex items-center justify-between px-4 lg:hidden z-50">
				<Link href="/dashboard" className="flex items-center space-x-2">
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
					<Link href="/dashboard" className="flex items-center space-x-2">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
							<span className="text-white font-bold text-xl">E</span>
						</div>
						<span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight hover:text-cyan-400 transition-colors duration-200">
							EVECS
						</span>
					</Link>
				</div>
				
				<nav className="px-3 py-6">
					<div className="px-4 mb-4">
						<span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
							Main Menu
						</span>
					</div>
					<ul className="space-y-1.5">
						<li>
							<Link 
								href="/dashboard" 
								className={linkClass("/dashboard")}
								onClick={handleLinkClick}
							>
								<HomeIcon className="w-5 h-5" />
								<span>Dashboard</span>
							</Link>
						</li>
						<li>
							<Link 
								href="/dashboard/timetable" 
								className={linkClass("/dashboard/timetable")}
								onClick={handleLinkClick}
							>
								<CalendarIcon className="w-5 h-5" />
								<span>Timetable</span>
							</Link>
						</li>
						<li>
							<Link 
								href="/dashboard/events" 
								className={linkClass("/dashboard/events")}
								onClick={handleLinkClick}
							>
								<BuildingOfficeIcon className="w-5 h-5" />
								<span>Events</span>
							</Link>
						</li>
					</ul>
				</nav>

				<div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800/50">
					<Link 
						href="/dashboard/account" 
						className={`${linkClass("/dashboard/account")} hover:bg-gray-800`}
						onClick={handleLinkClick}
					>
						<UserIcon className="w-5 h-5" />
						<span>Account</span>
					</Link>
				</div>
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
