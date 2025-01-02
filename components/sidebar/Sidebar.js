"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
	const [selected, setSelected] = useState("Home");

	const linkClass = (pageName) => {
		return ` ${
				selected === pageName ? "text-blue-400 font-bold" : ""
		}`;
	};

	const selectedPage = (page) => {
			setSelected(page);
	};

	return (
		<aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 flex flex-col">
			<Link href="/" onClick={() => selectedPage("Home")} className="text-2xl font-bold mb-4 select-none cursor-pointer">EVECS</Link>
			<nav className="flex-grow">
				<ul className="space-y-2">
					<li className="hover:bg-gray-700 rounded-md cursor-pointer">
						<Link href="/" className={`${linkClass("Home")} block p-2 w-full`} onClick={() => selectedPage("Home")}>
							Home
						</Link>
					</li>
					<li className="hover:bg-gray-700 rounded-md cursor-pointer">
						<Link href="/timetable" className={`${linkClass("Timetable")} block p-2 w-full`} onClick={() => selectedPage("Timetable")}>
							Timetable
						</Link>
					</li>
					<li className="hover:bg-gray-700 rounded-md cursor-pointer">
						<Link href="/events" className={`${linkClass("Events")} block p-2 w-full`} onClick={() => selectedPage("Events")}>
							Events
						</Link>
					</li>
				</ul>
			</nav>
			<div className="border-t border-gray-700 pt-4">
				<Link href="/account" className={`${linkClass("Account")} hover:bg-gray-700 rounded-md cursor-pointer block p-2 w-full`} onClick={() => selectedPage("Account")}>
					Account
				</Link>
			</div>
		</aside>
	);
}
