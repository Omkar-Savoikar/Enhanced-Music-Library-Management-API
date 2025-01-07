import albumService from "../services/album.service.js";
import artistService from "../services/artist.service.js";
import trackService from "../services/track.service.js";
import responseHandler from "../utils/response.utils.js";
import validator from "../utils/validator.utils.js";

const getTracks = async (req, res) => {
	try {
		const { limit, offset, artist_id, album_id, hidden } = req.query;
		const tracks = await trackService.getTracks({
			limit: parseInt(limit),
			offset: parseInt(offset),
			artist_id: artist_id !== undefined ? artist_id : undefined,
			album_id: album_id !== undefined ? album_id : undefined,
			hidden: hidden !== undefined ? hidden === "true" : undefined,
		});

		const formattedTracks = tracks.map((track) => ({
			track_id: track._id,
			artist_name: track.artist_id.name,
			album_name: track.album_id.name,
			name: track.name,
			duration: track.duration,
			hidden: track.hidden,
		}));

		return responseHandler.success(res, 200, formattedTracks, "Tracks retrieved successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const getTrackById = async (req, res) => {
	try {
		const track = await trackService.getTrackById(req.params.id);
		if (!track) return responseHandler.error(res, 404, "Track not found.");

		const formattedTrack = {
			_id: track._id,
			artistName: track.artist_id.name,
			albumName: track.album_id.name,
			name: track.name,
			duration: track.duration,
			hidden: track.hidden,
		};

		return responseHandler.success(res, 200, formattedTrack, "Track retrieved successfully.");
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Track not found.");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const createTrack = async (req, res) => {
	try {
		const { error } = validator.validateTrackInput(req.body);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		const artist = await artistService.getArtistById(req.body.artist_id);
		const album = await albumService.getAlbumById(req.body.album_id);

		if (!artist || !album) return responseHandler.error(res, 400, "Bad Request");

		await trackService.createTrack(req.body);
		return responseHandler.success(res, 201, null, "Track created successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const updateTrack = async (req, res) => {
	try {
		const { error } = validator.validateTrackInput(req.body, true);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		const track = await trackService.updateTrack(req.params.id, req.body);
		if (!track) return responseHandler.error(res, 404, "Track not found.");

		return responseHandler.success(res, 204);
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Track not found.");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const deleteTrack = async (req, res) => {
	try {
		const track = await trackService.deleteTrack(req.params.id);
		if (!track) return responseHandler.error(res, 404, "Track not found.");

		return responseHandler.success(res, 200, null, `Track: ${track.name} deleted successfully.`);
	} catch (error) {
		if (error.name === "CastError") return responseHandler.error(res, 404, "Track not found.");
		return responseHandler.error(res, 400, "Bad Request");
	}
};

export default {
	getTracks,
	getTrackById,
	createTrack,
	updateTrack,
	deleteTrack,
};
