"use client";

import { useEvents } from "@/hooks/events";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function Page() {
	const { user, token } = useAuth();
	const { createEvent } = useEvents();
	const { push } = useRouter();

	if (!user || !token) {
		return (
			<div className="w-full flex justify-center items-center flex-col gap-6 px-6">
				<p>{"Vous n'êtes pas connecté"}</p>
			</div>
		);
	}

	return (
		<div className="w-full flex justify-center items-center flex-col gap-6 px-6">
			<h1 className="text-lg font-bold m-0 text-blue-500">Inscription</h1>
			<input
				className="bg-blue-50 w-full p-2"
				type="text"
				placeholder="Titre"
				id="title"
			/>
			<input
				className="bg-blue-50 w-full p-2"
				type="text"
				placeholder="Description"
				id="description"
			/>
			<input
				className="bg-blue-50 w-full p-2"
				type="date"
				placeholder="Date"
				id="date"
			/>
			<input
				className="bg-blue-50 w-full p-2"
				type="text"
				placeholder="Lieu"
				id="location"
			/>
			<button
				onClick={async () => {
					const title = (document.getElementById("title") as HTMLInputElement).value;
					const description = (document.getElementById("description") as HTMLInputElement).value;
					const date = (document.getElementById("date") as HTMLInputElement).value;
					const location = (document.getElementById("location") as HTMLInputElement).value;
					await createEvent(title, description, new Date(date), location, token);
					push("/events");
				}}
				className="bg-blue-500 text-white rounded px-2 py-1"
			>
				Créer
			</button>
		</div>
	);
}
