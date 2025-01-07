import { Router } from "express";

import { ROLES } from "../config/constants.js";
import ArtistController from "../controllers/artist.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const artistRouter = Router();

artistRouter.use(AuthMiddleware.authenticate);

artistRouter.get("/", ArtistController.getArtists);

artistRouter.get("/:id", ArtistController.getArtistById);

artistRouter.post("/add-artist", AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]), ArtistController.createArtist);

artistRouter.put("/:id", AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]), ArtistController.updateArtist);

artistRouter.delete("/:id", AuthMiddleware.authorize([ROLES.ADMIN]), ArtistController.deleteArtist);

export default artistRouter;
