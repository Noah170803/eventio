"use client";

import { useEvents } from "@/hooks/events";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
	const { events, loading, fetchEvents } = useEvents();

	useEffect(() => {
		fetchEvents();
	}, []);

	return (
		<div className="w-full flex flex-col gap-6 px-6">
			<div className="w-full flex justify-between">
				<h1 className="text-lg font-bold m-0 text-blue-500">Tous les événements</h1>
				<Link href="/events/create">
					<span className="bg-blue-500 text-white rounded px-2 py-1">Créer</span>
				</Link>
			</div>
			<div className="w-full min-h-48 flex justify-center items-center">
				{loading && <p>Chargement...</p>}
				{!loading && events.length === 0 && <p>Aucun événement pour le moment.</p>}
				{!loading && events.length > 0 && (
					<div className="grid auto-cols-auto w-full gap-6">
						{events.map((event) => (
							<div
								key={event.id}
								className="w-full bg-blue-50 p-4 rounded flex justify-between"
							>
								<div className="flex flex-col">
									<h2 className="text-lg font-bold text-blue-500">{event.title}</h2>
									<p>{event.description}</p>
									<p>{new Date(event.date).toDateString()}</p>
									<p>{event.location}</p>
								</div>
								<div>
									<Link href={`/events/${event.id}`}>
										<span className="bg-blue-500 text-white rounded px-2 py-1">Voir</span>
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
