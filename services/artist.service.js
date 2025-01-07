import Album from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import Track from "../models/track.model.js";

const getArtists = async ({ limit = 5, offset = 0, grammy, hidden }) => {
	const query = {};

	if (grammy !== undefined) query.grammy = grammy;
	if (hidden !== undefined) query.hidden = hidden;

	return await Artist.find(query).sort({ name: 1 }).skip(offset).limit(limit).select("-__v");
};

const getArtistById = async (id) => {
	const artist = await Artist.findById(id);

	if (!artist) return null;

	return artist;
};

const createArtist = async (artistData) => {
	return await Artist.create(artistData);
};

const updateArtist = async (id, artistData) => {
	return await Artist.findByIdAndUpdate(id, artistData, { new: true, runValidators: true });
};

const deleteArtist = async (id) => {
	try {
		const artist = await Artist.findByIdAndDelete(id);
		if (!artist) throw new Error("Artist not found");

		await Album.deleteMany({ artist_id: id });
		await Track.deleteMany({ artist_id: id });

		return artist;
	} catch (error) {
		throw error;
	}
};

export default {
	getArtists,
	getArtistById,
	createArtist,
	updateArtist,
	deleteArtist,
};
