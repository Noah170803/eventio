"use client";

import { API_URL } from "@/constants";
import { useState } from "react";

export interface IEvent {
	id: number;
	title: string;
	description: string;
	organizerId: number;
	date: Date;
	location: string;
}

export interface IParticipant {
	id: number;
	userId: number;
	eventId: number;
}

export const useEvents = () => {
	const [events, setEvents] = useState<IEvent[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchEvents = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events`, {
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setEvents(data);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const createEvent = async (
		title: string,
		description: string,
		date: Date,
		location: string,
		token: string
	) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ title, description, date, location, token }),
			});
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	return {
		events,
		loading,
		fetchEvents,
		createEvent,
	};
};

export const useEvent = (id: number) => {
	const [event, setEvent] = useState<(IEvent & { participants: IParticipant[] }) | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchEvent = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events/${id}`, {
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setEvent({ ...data.event, participants: data.participants });
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const deleteEvent = async (token: string) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events/${id}`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const participate = async (token: string) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events/${id}/participate`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const unparticipate = async (token: string) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events/${id}/unparticipate`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	return {
		event,
		loading,
		fetchEvent,
		deleteEvent,
		participate,
		unparticipate,
	};
};
