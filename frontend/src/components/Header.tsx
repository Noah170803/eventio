"use client";

import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export const Header = () => {
	const { user } = useAuth();

	return (
		<header className="w-full flex justify-between items-center h-20 px-6 bg-blue-50">
			<Link href="/">
				<img
					src="/logo.png"
					alt="Eventio Logo"
					className="w-8 h-8"
				/>
			</Link>
			{!user && (
				<div className="flex items-center justify-end gap-6">
					<Link href="/login">
						<span className="text-blue-500">Se connecter</span>
					</Link>
					<Link href="/register">
						<span className="bg-blue-500 text-white rounded px-2 py-1">{"S'inscrire"}</span>
					</Link>
				</div>
			)}
			{user && (
				<div className="flex items-center justify-end">
					<span className="text-blue-500">{user.fullName}</span>
				</div>
			)}
		</header>
	);
};
