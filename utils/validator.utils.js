import joi from "joi";

const validateAlbumInput = (data, isUpdate = false) => {
	const schema = joi.object({
		name: isUpdate ? joi.string() : joi.string().required(),
		artist_id: isUpdate ? joi.string() : joi.string().required(),
		year: joi.number().min(1900).max(new Date().getFullYear()),
		hidden: joi.boolean(),
	});

	return schema.validate(data);
};

const validateArtistInput = (data, isUpdate = false) => {
	const schema = joi.object({
		name: isUpdate ? joi.string() : joi.string().required(),
		grammy: joi.number().min(0),
		hidden: joi.boolean(),
	});

	return schema.validate(data);
};

const validateTrackInput = (data, isUpdate = false) => {
	const schema = joi.object({
		name: isUpdate ? joi.string() : joi.string().required(),
		artist_id: isUpdate ? joi.string() : joi.string().required(),
		album_id: isUpdate ? joi.string() : joi.string().required(),
		duration: joi.number().min(1),
		hidden: joi.boolean(),
	});

	return schema.validate(data);
};

const validateFavoriteInput = (data) => {
	const schema = joi.object({
		category: joi.string().valid("artist", "album", "track").required(),
		item_id: joi.string().required(),
	});

	return schema.validate(data);
};

const validateUserInput = (data, isUpdate = false) => {
	const schema = joi.object({
		email: isUpdate ? joi.string() : joi.string().required(),
		password: isUpdate ? joi.string() : joi.string().required(),
		old_password: isUpdate ? joi.string().required() : joi.string(),
		new_password: isUpdate ? joi.string().required() : joi.string(),
		role: isUpdate ? joi.string() : joi.string().required(),
	});

	return schema.validate(data);
};

const validateSignupInput = (data) => {
	const schema = joi.object({
		email: joi.string().required(),
		password: joi.string().required(),
	});

	return schema.validate(data);
};

const validateLoginInput = (data) => {
	const schema = joi.object({
		email: joi.string().required(),
		password: joi.string().required(),
	});

	return schema.validate(data);
};

export default {
	validateAlbumInput,
	validateArtistInput,
	validateFavoriteInput,
	validateTrackInput,
	validateUserInput,
	validateSignupInput,
	validateLoginInput,
};
