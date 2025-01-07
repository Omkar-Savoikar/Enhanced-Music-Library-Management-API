import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/database.js";
import albumRouter from "./routes/album.routes.js";
import artistRouter from "./routes/artist.routes.js";
import authRouter from "./routes/auth.routes.js";
import favoriteRouter from "./routes/favorite.routes.js";
import trackRouter from "./routes/track.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/albums", albumRouter);
app.use("/api/v1/artists", artistRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/tracks", trackRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/", authRouter);

app.use("/", (req, res) => {
	return res.status(200).json({ message: "Welcome to Music API" });
});

let server;

app.startServer = async () => {
	await connectDB(process.env.MONGODB_URI);
	server = app.listen(process.env.PORT, () => {
		console.log(`Listening at http://localhost:${process.env.PORT}`);
	});
};

app.closeServer = () => {
	if (server) {
		server.close(() => {
			console.log("Server closed");
		});
	}
};

app.startServer();

export default app;
