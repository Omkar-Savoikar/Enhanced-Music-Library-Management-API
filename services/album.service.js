import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

const getAlbums = async ({ limit = 5, offset = 0, artist_id, hidden }) => {
	const query = {};

	if (artist_id) query.artist_id = artist_id;
	if (hidden !== undefined) query.hidden = hidden;

	return await Album.find(query)
		.populate("artist_id", "name")
		.sort({ year: -1 })
		.skip(offset)
		.limit(limit)
		.select("-__v");
};

const getAlbumById = async (id) => {
	let album = await Album.findById(id);
	if (!album) return null;

	return album.populate("artist_id", "name");
};

const createAlbum = async (albumData) => {
	return await Album.create(albumData);
};

const updateAlbum = async (id, albumData) => {
	return await Album.findByIdAndUpdate(id, albumData, { new: true });
};

const deleteAlbum = async (id) => {
	const session = await startSession();
	session.startTransaction();

	try {
		// Delete the album
		const album = await Album.findByIdAndDelete(id).session(session);
		if (!album) throw new Error("Album not found");

		// Delete associated tracks
		await Track.deleteMany({ album_id: id }).session(session);

		await session.commitTransaction();
		return album;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
};

export default {
	getAlbums,
	getAlbumById,
	createAlbum,
	updateAlbum,
	deleteAlbum,
};
