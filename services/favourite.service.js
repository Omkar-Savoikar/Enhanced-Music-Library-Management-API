import Favorite from "../models/favorite.model.js";

const getFavorites = async (userId, category, { limit = 5, offset = 0 }) => {
	const favorites = await Favorite.find({ user_id: userId, category })
		.sort({ createdAt: -1 })
		.skip(offset)
		.limit(limit)
		.select("-__v");

	if (!favorites) return [];

	return favorites;
};

const getFavorite = async (favoriteData) => {
	return await Favorite.findOne(favoriteData);
};

const getFavoritebyId = async (id) => {
	return await Favorite.findById(id);
};

const addFavorite = async (user_id, category, item_id, name) => {
	return await Favorite.create({ user_id, category, item_id, name });
};

const removeFavorite = async (favoriteId) => {
	return await Favorite.findByIdAndDelete(favoriteId);
};

export default {
	getFavorites,
	getFavorite,
	getFavoritebyId,
	addFavorite,
	removeFavorite,
};
