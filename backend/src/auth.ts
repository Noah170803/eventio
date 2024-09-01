import express from "express";
import { z } from "zod";
import { IUser, Session, User } from "./models";
import { randomBytes } from "crypto";

/**
 * Routeur qui gère l'authentification des utilisateurs
 */
export const authRouter = express.Router();

/**
 * Route qui permet à l'utilisateur de s'inscrire sur l'application
 *
 * POST /api/auth/signup
 *
 * 400 - Si les données envoyées ne sont pas valides
 * 409 - Si l'email est déjà utilisé
 * 201 - Si l'utilisateur a été créé avec succès
 * 500 - Si une erreur inattendue se produit
 */
authRouter.post("/signup", async (req, res) => {
	try {
		const SignupBodySchema = z.object({
			email: z.string().email(),
			password: z.string().min(6),
			fullName: z.string(),
		});

		const payload = SignupBodySchema.safeParse(req.body);

		if (!payload.success) {
			return res.status(400).json({ error: payload.error });
		}

		const data = payload.data;

		// Vérifier si l'email est déjà utilisé
		const existingUser = await User.findOne({
			where: {
				email: data.email,
			},
		});

		if (existingUser) {
			return res.status(409).json({
				error: "Cet addresse email est déjà utilisée par un utilisateur de l'application.",
			});
		}

		// Créer l'utilisateur
		const newUser = await User.create({
			email: data.email,
			password: data.password,
			fullName: data.fullName,
		});

		return res.status(201).json({ user: newUser });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet à l'utilisateur de se connecter à l'application
 *
 * POST /api/auth/login
 *
 * 400 - Si les données envoyées ne sont pas valides
 * 401 - Si les identifiants sont incorrects
 * 200 - Si l'utilisateur a été connecté avec succès
 * 500 - Si une erreur inattendue se produit
 */
authRouter.post("/login", async (req, res) => {
	try {
		const LoginBodySchema = z.object({
			email: z.string().email(),
			password: z.string().min(6),
		});

		const payload = LoginBodySchema.safeParse(req.body);

		if (!payload.success) {
			return res.status(400).json({ error: payload.error });
		}

		const data = payload.data;

		// Trouver l'utilisateur avec cet email
		const user = (await User.findOne({
			where: {
				email: data.email,
			},
		})) as IUser | null;

		if (!user || user.password != data.password) {
			return res.status(401).json({ error: "Identifiants incorrects" });
		}

		const token = randomBytes(32).toString("hex");

		// Créer une session pour l'utilisateur
		await Session.create({
			token,
			userId: user.id,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 semaine
		});

		return res.status(200).json({ user, token });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});

/**
 * Route qui permet à l'utilisateur de se déconnecter de l'application
 *
 * POST /api/auth/logout
 *
 * 200 - Si l'utilisateur a été déconnecté avec succès
 */

authRouter.post("/logout", async (req, res) => {
	try {
		const token = req.cookies.session;

		if (!token) {
			return res.status(200).json({ message: "L'utilisateur est déjà déconnecté." });
		}

		await Session.destroy({
			where: {
				token,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Une erreur inattendue s'est produite." });
	}
});
