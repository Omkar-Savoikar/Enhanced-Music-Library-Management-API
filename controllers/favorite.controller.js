import { FAVORITE_CATEGORIES } from "../config/constants.js";
import Album from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import Track from "../models/track.model.js";
import favoriteService from "../services/favourite.service.js";
import responseHandler from "../utils/response.utils.js";
import validator from "../utils/validator.utils.js";

const getFavorites = async (req, res) => {
	try {
		const { category } = req.params;
		const { limit, offset } = req.query;

		if (!Object.values(FAVORITE_CATEGORIES).includes(category))
			return responseHandler.error(res, 400, "Bad request");

		const favorites = await favoriteService.getFavorites(req.user._id, category, {
			limit: parseInt(limit),
			offset: parseInt(offset),
		});

		const formattedFavorites = favorites.map((favorite) => ({
			favorite_id: favorite._id,
			item_id: favorite.item_id,
			created_at: favorite.createdAt,
			...favorite,
		}));

		return responseHandler.success(res, 200, formattedFavorites, "Favorites retrieved successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const addFavorite = async (req, res) => {
	try {
		const { category, item_id } = req.body;

		const { error } = validator.validateFavoriteInput(req.body);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		let item;
		switch (category) {
			case "artist":
				item = await Artist.findById(item_id);
				break;
			case "album":
				item = await Album.findById(item_id);
				break;
			case "track":
				item = await Track.findById(item_id);
				break;
		}

		if (!item) return responseHandler.error(res, 400, `${category} not found.`);

		const existingFavorite = await favoriteService.getFavorite({
			user: req.user._id,
			category,
			item_id,
			name: item.name,
		});

		if (existingFavorite) return responseHandler.error(res, 400, "Item already in favorites");

		await favoriteService.addFavorite(req.user._id, category, item_id, item.name);
		return responseHandler.success(res, 201, null, "Favorite added successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const removeFavorite = async (req, res) => {
	try {
		let favorite = await favoriteService.getFavoritebyId(req.params.id);
		if (!favorite) return responseHandler.error(res, 404, "Favorite not found.");

		if (req.user._id.toString() !== favorite.user_id.toString())
			return responseHandler.error(res, 403, "Forbidden Access");

		await favoriteService.removeFavorite(req.params.id);

		return responseHandler.success(res, 200, null, `Favorite removed successfully.`);
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

export default {
	getFavorites,
	addFavorite,
	removeFavorite,
};
