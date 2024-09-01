"use client";

import { API_URL } from "@/constants";
import { ResponseError, Result } from "@/utils";
import { createContext, useContext, useState } from "react";

/**
 * Interface représentant un utilisateur connecté.
 */
export interface IUser {
	id: number;
	email: string;
	fullName: string;
}

/**
 * Interface représentant le contexte d'authentification.
 */
export interface AuthContext {
	user: IUser | null;
	token: string | null;
	register: (email: string, password: string, fullName: string) => Promise<Result<IUser>>;
	login: (email: string, password: string) => Promise<Result<IUser>>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
	user: null,
	token: null,
	register: async () => {
		throw new Error("AuthProvider not found");
	},
	login: async () => {
		throw new Error("AuthProvider not found");
	},
	logout: async () => {
		throw new Error("AuthProvider not found");
	},
});

/**
 * Hook permettant de récupérer le contexte d'authentification.
 */
export const useAuth = () => {
	return useContext(AuthContext);
};

/**
 * Provider permettant de gérer l'authentification.
 */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<IUser | null>(null);

	const register = async (
		email: string,
		password: string,
		fullName: string
	): Promise<Result<IUser>> => {
		const response = await fetch(`${API_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ email, password, fullName }),
		});

		const body = await response.json();

		if (response.status !== 201) {
			return {
				type: "error",
				error: (body as ResponseError).error,
			};
		}

		const {
			user: { id },
		} = body as { user: IUser };

		const newUser = {
			id,
			email,
			fullName,
		};

		return {
			type: "success",
			data: newUser,
		};
	};

	const login = async (email: string, password: string): Promise<Result<IUser>> => {
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ email, password }),
		});

		const body = await response.json();

		if (response.status !== 200) {
			return {
				type: "error",
				error: (body as ResponseError).error,
			};
		}

		const {
			user: { id, fullName },
			token: newToken,
		} = body as { user: IUser; token: string };

		const newUser = {
			id,
			email,
			fullName,
		};

		setUser(newUser);
		setToken(newToken);

		return {
			type: "success",
			data: newUser,
		};
	};

	const logout = async (): Promise<void> => {
		const response = await fetch(`${API_URL}/api/auth/logout`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			setUser(null);
			setToken(null);
		}

		return;
	};

	return (
		<AuthContext.Provider value={{ user, token, register, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
