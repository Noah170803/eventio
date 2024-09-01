import express from "express";
import { eventRouter } from "./event";
import { authRouter } from "./auth";
import cors from "cors";

const app = express();

app.use(express.json()); // Permet de parser les requêtes en JSON

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
	})
);

app.options(
	"*",
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
	})
);

app.use("/api/events", eventRouter); // Ajout du routeur des événements
app.use("/api/auth", authRouter); // Ajout du routeur d'authentification

/**
 * Route qui permet de vérifier si le serveur fonctionne correctement
 *
 * GET /
 *
 * 200 - Si le serveur fonctionne correctement
 */
app.get("/api", async (_: express.Request, res: express.Response) => {
	return res.status(200).send("Le serveur fonctionne correctement.");
});

app.listen(8080, () => {
	console.log("Le serveur écoute sur le port 8080.");
});
