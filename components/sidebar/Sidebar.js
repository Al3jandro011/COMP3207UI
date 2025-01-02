"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
	const pathname = usePathname();

	const linkClass = (path) => {
		return `${pathname === path ? "text-blue-400 font-bold" : ""}`;
	};

	return (
		<aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 flex flex-col">
			<Link href="/" className="text-2xl font-bold mb-4 select-none cursor-pointer">EVECS</Link>
			<nav className="flex-grow">
				<ul className="space-y-2">
					<li className="hover:bg-gray-700 rounded-md cursor-pointer">
						<Link href="/" className={`${linkClass("/")} block p-2 w-full`}>
							Home
						</Link>
					</li>
					<li className="hover:bg-gray-700 rounded-md cursor-pointer">
						<Link href="/timetable" className={`${linkClass("/timetable")} block p-2 w-full`}>
							Timetable
						</Link>
					</li>
					<li className="hover:bg-gray-700 rounded-md cursor-pointer">
						<Link href="/events" className={`${pathname.startsWith("/events") ? "text-blue-400 font-bold" : ""} block p-2 w-full`}>
							Events
						</Link>
					</li>
				</ul>
			</nav>
			<div className="border-t border-gray-700 pt-4">
				<Link href="/account" className={`${linkClass("/account")} hover:bg-gray-700 rounded-md cursor-pointer block p-2 w-full`}>
					Account
				</Link>
			</div>
		</aside>
	);
}
