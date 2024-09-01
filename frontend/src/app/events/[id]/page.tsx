"use client";

import { useEvent, useEvents } from "@/hooks/events";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const { id } = useParams();
	const { push } = useRouter();
	const { user, token } = useAuth();
	const { event, fetchEvent, loading, deleteEvent, participate, unparticipate } = useEvent(
		Number(id)
	);

	useEffect(() => {
		fetchEvent();
	}, []);

	if (loading) {
		return <p>Chargement...</p>;
	}

	if (loading || !event) {
		return <p>Événement introuvable.</p>;
	}

	return (
		<div className="w-full flex flex-col gap-6 px-6">
			<div className="w-full flex justify-between">
				<h1 className="text-lg font-bold m-0 text-blue-500">{event.title}</h1>
				{user && user.id === event.organizerId && token && (
					<button
						onClick={async () => {
							await deleteEvent(token);
							push("/events");
						}}
						className="bg-red-500 text-white rounded px-2 py-1"
					>
						Supprimer
					</button>
				)}
			</div>
			<p>{event.description}</p>
			<p>{new Date(event.date).toDateString()}</p>
			<p>{event.location}</p>
			<div className="flex justify-between items-center">
				<h2 className="text-blue-500 font-bold text-lg">Participants</h2>
				{user && token && (
					<div className="flex items-center gap-3">
						{event.participants.find((participant) => participant.userId === user.id) ? (
							<button
								onClick={async () => {
									await unparticipate(token);
									fetchEvent();
								}}
								className="bg-red-500 text-white rounded px-2 py-1"
							>
								Ne plus participer
							</button>
						) : (
							<button
								onClick={async () => {
									await participate(token);
									fetchEvent();
								}}
								className="bg-blue-500 text-white rounded px-2 py-1"
							>
								Participer
							</button>
						)}
					</div>
				)}
			</div>
			<div className="w-full flex flex-col gap-3 justify-center items-center max-w-[600px]">
				{event.participants.map((participant) => (
					<div
						key={participant.id}
						className="w-full bg-blue-50 p-4 rounded flex flex-col justify-between"
					>
						<p>Identifiant du Participant: {participant.userId}</p>
					</div>
				))}
			</div>
		</div>
	);
}
