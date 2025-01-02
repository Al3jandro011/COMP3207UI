"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

export default function Sidebar() {
	const pathname = usePathname();
	const { isDark, toggleTheme } = useTheme();

	const linkClass = (path) => {
		const isActive = pathname === path || pathname.startsWith(`${path}/`);
		return `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
			isActive 
				? "bg-gradient-to-r from-cyan-500/10 to-cyan-500/20 text-cyan-400 font-medium border-r-2 border-cyan-400" 
				: "text-gray-400 hover:bg-gray-800 hover:text-white"
		}`;
	};

	return (
		<aside className="fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800/50">
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
			
			<nav className="px-3 py-6">
				<div className="flex items-center justify-between px-4 mb-4">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
						Main Menu
					</span>
					<button
						onClick={toggleTheme}
						className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
											text-gray-500 dark:text-gray-400 hover:bg-gray-200 
											dark:hover:bg-gray-700 transition-colors duration-200"
						aria-label="Toggle theme"
					>
						{isDark ? (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						) : (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
							</svg>
						)}
					</button>
				</div>
				<ul className="space-y-1.5">
					<li>
						<Link href="/" className={linkClass("/")}>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							<span>Dashboard</span>
						</Link>
					</li>
					<li>
						<Link href="/timetable" className={linkClass("/timetable")}>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span>Timetable</span>
						</Link>
					</li>
					<li>
						<Link href="/events" className={linkClass("/events") || pathname.startsWith("/events/")}>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							<span>Events</span>
						</Link>
					</li>
				</ul>
			</nav>

			<div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800/50 p-4">
				<Link href="/account" className={`${linkClass("/account")} hover:bg-gray-800`}>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<span>Account</span>
				</Link>
			</div>
		</aside>
	);
}
