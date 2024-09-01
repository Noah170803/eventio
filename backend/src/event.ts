import express from "express";
import { Event, IEvent, IParticipant, ISession, IUser, Participant, Session, User } from "./models";
import { z } from "zod";

/**
 * Routeur qui gère les événements
 */
export const eventRouter = express.Router();

/**
 * Route qui permet de récupérer la liste des événements
 *
 * GET /api/events
 *
 * 200 - La liste des événements
 * 500 - Une erreur inattendue s'est produite
 */

eventRouter.get("/", async (req, res) => {
	try {
		const events = await Event.findAll();
		return res.status(200).json(events);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet de récupérer un événement et ses participants
 *
 * GET /api/events/:id
 *
 * 200 - L'événement et ses participants
 * 404 - L'événement n'existe pas
 * 500 - Une erreur inattendue s'est produite
 */

eventRouter.get("/:id", async (req, res) => {
	try {
		const event = (await Event.findByPk(req.params.id)) as IEvent | null;
		if (!event) {
			return res.status(404).json({ message: "L'événement n'existe pas." });
		}

		const participants = (await Participant.findAll({
			where: {
				eventId: event.id,
			},
		})) as unknown as IParticipant[];

		return res.status(200).json({
			event,
			participants,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet de créer un événement
 *
 * POST /api/events
 *
 * 201 - L'événement a été créé avec succès
 * 400 - Les données envoyées ne sont pas valides
 * 401 - L'utilisateur n'est pas connecté
 * 500 - Une erreur inattendue s'est produite
 */
eventRouter.post("/", async (req, res) => {
	try {
		const CreateEventBodySchema = z.object({
			title: z.string(),
			description: z.string(),
			date: z.string(),
			location: z.string(),
			token: z.string(),
		});

		const payload = CreateEventBodySchema.safeParse(req.body);

		if (!payload.success) {
			return res.status(400).json({ error: payload.error });
		}

		const data = payload.data;

		if (!data.token) {
			return res
				.status(401)
				.json({ error: "Vous devez être connecté pour accéder à cette ressource." });
		}

		const session = (await Session.findOne({
			where: {
				token: data.token,
			},
		})) as ISession | null;

		if (!session || session.expiresAt < new Date()) {
			return res.status(401).json({ error: "Votre session a expiré. Veuillez vous reconnecter." });
		}

		const user = (await User.findByPk(session.userId)) as IUser | null;

		if (!user) {
			return res
				.status(401)
				.json({ error: "Votre session est invalide. Veuillez vous reconnecter." });
		}

		const newEvent = await Event.create({
			title: data.title,
			description: data.description,
			date: new Date(data.date),
			organizerId: user.id,
			location: data.location,
		});

		return res.status(201).json({ event: newEvent });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet de supprimer un événement
 *
 * DELETE /api/events/:id
 *
 * 401 - L'utilisateur n'est pas connecté
 * 404 - L'événement n'existe pas
 * 403 - L'utilisateur n'est pas l'organisateur de l'événement
 * 200 - L'événement a été supprimé avec succès
 * 500 - Une erreur inattendue s'est produite
 */
eventRouter.delete("/:id", async (req, res) => {
	try {
		const DeleteEventBodySchema = z.object({
			token: z.string(),
		});

		const payload = DeleteEventBodySchema.safeParse(req.body);

		if (!payload.success) {
			return res.status(400).json({ error: payload.error });
		}

		const data = payload.data;

		if (!data.token) {
			return res
				.status(401)
				.json({ error: "Vous devez être connecté pour accéder à cette ressource." });
		}

		const session = (await Session.findOne({
			where: {
				token: data.token,
			},
		})) as ISession | null;

		if (!session || session.expiresAt < new Date()) {
			return res.status(401).json({ error: "Votre session a expiré. Veuillez vous reconnecter." });
		}

		const user = (await User.findByPk(session.userId)) as IUser | null;

		if (!user) {
			return res
				.status(401)
				.json({ error: "Votre session est invalide. Veuillez vous reconnecter." });
		}

		const event = (await Event.findByPk(req.params.id)) as IEvent | null;

		if (!event) {
			return res.status(404).json({ error: "L'événement n'existe pas." });
		}

		if (event.organizerId !== user.id) {
			return res.status(403).json({ error: "Vous n'êtes pas l'organisateur de cet événement." });
		}

		await Event.destroy({
			where: {
				id: event.id,
			},
		});

		return res.status(200).json({ message: "L'événement a été supprimé avec succès." });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet de s'inscrire à un événement
 *
 * POST /api/events/:id/participate
 *
 * 401 - L'utilisateur n'est pas connecté
 * 404 - L'événement n'existe pas
 * 409 - L'utilisateur est déjà inscrit à cet événement
 * 201 - L'utilisateur a été inscrit à l'événement
 * 500 - Une erreur inattendue s'est produite
 */
eventRouter.post("/:id/participate", async (req, res) => {
	try {
		const ParticipateEventBodySchema = z.object({
			token: z.string(),
		});

		const payload = ParticipateEventBodySchema.safeParse(req.body);

		if (!payload.success) {
			return res.status(400).json({ error: payload.error });
		}

		const data = payload.data;

		if (!data.token) {
			return res
				.status(401)
				.json({ error: "Vous devez être connecté pour accéder à cette ressource." });
		}

		const session = (await Session.findOne({
			where: {
				token: data.token,
			},
		})) as ISession | null;

		if (!session || session.expiresAt < new Date()) {
			return res.status(401).json({ error: "Votre session a expiré. Veuillez vous reconnecter." });
		}

		const user = (await User.findByPk(session.userId)) as IUser | null;

		if (!user) {
			return res
				.status(401)
				.json({ error: "Votre session est invalide. Veuillez vous reconnecter." });
		}

		const event = (await Event.findByPk(req.params.id)) as IEvent | null;

		if (!event) {
			return res.status(404).json({ error: "L'événement n'existe pas." });
		}

		const participant = (await Participant.findOne({
			where: {
				userId: user.id,
				eventId: event.id,
			},
		})) as IParticipant | null;

		if (participant) {
			return res.status(409).json({ error: "Vous êtes déjà inscrit à cet événement." });
		}

		await Participant.create({
			userId: user.id,
			eventId: event.id,
		});

		return res.status(201).json({ message: "Vous avez été inscrit à l'événement." });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet de se désinscrire d'un événement
 *
 * POST /api/events/:id/unparticipate
 *
 * 401 - L'utilisateur n'est pas connecté
 * 404 - L'événement n'existe pas
 * 404 - L'utilisateur n'est pas inscrit à cet événement
 * 200 - L'utilisateur a été désinscrit de l'événement
 * 500 - Une erreur inattendue s'est produite
 */

eventRouter.post("/:id/unparticipate", async (req, res) => {
	try {
		const UnparticipateEventBodySchema = z.object({
			token: z.string(),
		});

		const payload = UnparticipateEventBodySchema.safeParse(req.body);

		if (!payload.success) {
			return res.status(400).json({ error: payload.error });
		}

		const data = payload.data;

		if (!data.token) {
			return res
				.status(401)
				.json({ error: "Vous devez être connecté pour accéder à cette ressource." });
		}

		const session = (await Session.findOne({
			where: {
				token: data.token,
			},
		})) as ISession | null;

		if (!session || session.expiresAt < new Date()) {
			return res.status(401).json({ error: "Votre session a expiré. Veuillez vous reconnecter." });
		}

		const user = (await User.findByPk(session.userId)) as IUser | null;

		if (!user) {
			return res
				.status(401)
				.json({ error: "Votre session est invalide. Veuillez vous reconnecter." });
		}

		const event = (await Event.findByPk(req.params.id)) as IEvent | null;

		if (!event) {
			return res.status(404).json({ error: "L'événement n'existe pas." });
		}

		const participant = (await Participant.findOne({
			where: {
				userId: user.id,
				eventId: event.id,
			},
		})) as IParticipant | null;

		if (!participant) {
			return res.status(404).json({ error: "Vous n'êtes pas inscrit à cet événement." });
		}

		await Participant.destroy({
			where: {
				userId: user.id,
				eventId: event.id,
			},
		});

		return res.status(200).json({ message: "Vous avez été désinscrit de l'événement." });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});
