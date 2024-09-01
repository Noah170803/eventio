"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function Page() {
	const { user, login, logout } = useAuth();
	const { push } = useRouter();

	if (user) {
		return (
			<div className="w-full flex justify-center items-center flex-col gap-6 px-6">
				<h1 className="text-lg font-bold m-0 text-blue-500">Bienvenue {user.fullName}</h1>
				<p>Vous êtes connecté en tant que {user.email}</p>
				<button
					onClick={logout}
					className="bg-red-500 text-white rounded px-2 py-1"
				>
					Déconnexion
				</button>
			</div>
		);
	}

	return (
		<div className="w-full flex justify-center items-center flex-col gap-6 px-6">
			<h1 className="text-lg font-bold m-0 text-blue-500">Connexion</h1>
			<input
				className="bg-blue-50 w-full p-2"
				type="email"
				placeholder="Adresse email"
				id="email"
			/>
			<input
				className="bg-blue-50 w-full p-2"
				type="password"
				placeholder="Mot de passe"
				id="password"
			/>
			<button
				onClick={async () => {
					const email = (document.getElementById("email") as HTMLInputElement).value;
					const password = (document.getElementById("password") as HTMLInputElement).value;
					await login(email, password);
					push("/events");
				}}
				className="bg-blue-500 text-white rounded px-2 py-1"
			>
				Se connecter
			</button>
		</div>
	);
}
