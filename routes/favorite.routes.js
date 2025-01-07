import { Router } from "express";

import { ROLES } from "../config/constants.js";
import FavoriteController from "../controllers/favorite.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const favoriteRouter = Router();

favoriteRouter.use(AuthMiddleware.authenticate);

favoriteRouter.get("/:category", FavoriteController.getFavorites);

favoriteRouter.post(
	"/add-favorite",
	AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]),
	FavoriteController.addFavorite,
);

favoriteRouter.delete(
	"/remove-favorite/:id",
	FavoriteController.removeFavorite,
);

export default favoriteRouter;
