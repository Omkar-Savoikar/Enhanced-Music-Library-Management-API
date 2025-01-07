import Track from "../models/track.model.js";

const getTracks = async ({ limit = 5, offset = 0, artist_id, album_id, hidden }) => {
	const query = {};

	if (artist_id) query.artist_id = artist_id;
	if (album_id) query.album_id = album_id;
	if (hidden !== undefined) query.hidden = hidden;

	return await Track.find(query)
		.populate("artist_id", "name")
		.populate("album_id", "name")
		.sort({ name: 1 })
		.skip(offset)
		.limit(limit)
		.select("-__v");
};

const getTrackById = async (id) => {
	return await Track.findById(id).populate("artist_id", "name").populate("album_id", "name");
};

const createTrack = async (trackData) => {
	return await Track.create(trackData);
};

const updateTrack = async (id, trackData) => {
	return await Track.findByIdAndUpdate(id, trackData, { new: true });
};

const deleteTrack = async (id) => {
	return await Track.findByIdAndDelete(id);
};

export default {
	getTracks,
	getTrackById,
	createTrack,
	updateTrack,
	deleteTrack,
};
