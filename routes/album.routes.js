import { Router } from "express";

import { ROLES } from "../config/constants.js";
import AlbumController from "../controllers/album.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const albumRouter = Router();

albumRouter.use(AuthMiddleware.authenticate);

albumRouter.get("/", AlbumController.getAlbums);

albumRouter.get("/:id", AlbumController.getAlbumById);

albumRouter.post("/add-album", AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]), AlbumController.createAlbum);

albumRouter.put("/:id", AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]), AlbumController.updateAlbum);

albumRouter.delete("/:id", AuthMiddleware.authorize([ROLES.ADMIN]), AlbumController.deleteAlbum);

export default albumRouter;
