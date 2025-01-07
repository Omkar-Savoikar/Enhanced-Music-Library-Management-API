import albumService from "../services/album.service.js";
import responseHandler from "../utils/response.utils.js";
import validator from "../utils/validator.utils.js";

const getAlbums = async (req, res) => {
	try {
		const { limit, offset, artist_id, hidden } = req.query;
		const albums = await albumService.getAlbums({
			limit: parseInt(limit),
			offset: parseInt(offset),
			artist_id: artist_id !== undefined ? artist_id : undefined,
			hidden: hidden !== undefined ? hidden === "true" : undefined,
		});

		return responseHandler.success(res, 200, albums, "Albums retrieved successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const getAlbumById = async (req, res) => {
	try {
		const album = await albumService.getAlbumById(req.params.id);
		if (!album) return responseHandler.error(res, 404, "Album not found.");

		const formattedAlbum = {
			album_id: album._id,
			artist_name: album.artist_id.name,
			name: album.name,
			year: album.year,
			hidden: album.hidden,
		};

		return responseHandler.success(res, 200, formattedAlbum, "Album retrieved successfully.");
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Album not found.");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const createAlbum = async (req, res) => {
	try {
		const { error } = validator.validateAlbumInput(req.body);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		await albumService.createAlbum(req.body);
		return responseHandler.success(res, 201, null, "Album created successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const updateAlbum = async (req, res) => {
	try {
		const { error } = validator.validateAlbumInput(req.body);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		const album = await albumService.updateAlbum(req.params.id, req.body);
		if (!album) return responseHandler.error(res, 404, "Album not found.");

		return responseHandler.success(res, 204);
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const deleteAlbum = async (req, res) => {
	try {
		const album = await albumService.deleteAlbum(req.params.id);
		if (!album) return responseHandler.error(res, 404, "Album not found.");

		return responseHandler.success(res, 200, null, `Album: ${album.name} deleted successfully.`);
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

export default {
	getAlbums,
	getAlbumById,
	createAlbum,
	updateAlbum,
	deleteAlbum,
};
