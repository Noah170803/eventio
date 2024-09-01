import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Eventio - Organise et participe à des événements mémorables!",
	description: "Créez un compte et commencez à organiser des événements hors du communs!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className="w-full min-h-screen flex flex-col gap-6">
					<Header />
					<div>{children}</div>
				</body>
			</AuthProvider>
		</html>
	);
}
