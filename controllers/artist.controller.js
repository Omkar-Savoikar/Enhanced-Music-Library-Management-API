import artistService from "../services/artist.service.js";
import responseHandler from "../utils/response.utils.js";
import validator from "../utils/validator.utils.js";

const getArtists = async (req, res) => {
	try {
		const { limit, offset, grammy, hidden } = req.query;
		const artists = await artistService.getArtists({
			limit: parseInt(limit),
			offset: parseInt(offset),
			grammy: grammy !== undefined ? parseInt(grammy) : undefined,
			hidden: hidden !== undefined ? hidden === "true" : undefined,
		});

		return responseHandler.success(res, 200, artists, "Artists retrieved successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const getArtistById = async (req, res) => {
	try {
		const artist = await artistService.getArtistById(req.params.id);
		if (!artist) return responseHandler.error(res, 404, "Artist not found");

		const formattedArtist = {
			artist_id: artist._id,
			name: artist.name,
			grammy: artist.grammy,
			hidden: artist.hidden,
		};

		return responseHandler.success(res, 200, formattedArtist, "Artist retrieved successfully.");
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Artist not found");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const createArtist = async (req, res) => {
	try {
		const { error } = validator.validateArtistInput(req.body);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		await artistService.createArtist(req.body);
		return responseHandler.success(res, 201, null, "Artist created successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const updateArtist = async (req, res) => {
	try {
		const { error } = validator.validateArtistInput(req.body, true);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		const artist = await artistService.updateArtist(req.params.id, req.body);
		if (!artist) return responseHandler.error(res, 404, "Artist not found.");

		return responseHandler.success(res, 204, null, "Artist updated successfully.");
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Artist not found.");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const deleteArtist = async (req, res) => {
	try {
		const artist = await artistService.deleteArtist(req.params.id);
		if (!artist) return responseHandler.error(res, 404, "Artist not found.");

		return responseHandler.success(res, 200, null, `Artist: ${artist.name} deleted successfully.`);
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Artist not found.");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

export default {
	getArtists,
	getArtistById,
	createArtist,
	updateArtist,
	deleteArtist,
};
