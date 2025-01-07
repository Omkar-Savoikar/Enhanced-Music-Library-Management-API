import { Schema, model } from "mongoose";

import { FAVORITE_CATEGORIES } from "../config/constants.js";
import Artist from "./artist.model.js";
import Album from "./album.model.js";
import Track from "./track.model.js";
import { required } from "joi";

const favoriteSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: String,
			enum: Object.values(FAVORITE_CATEGORIES),
			required: true,
		},
		item_id: {
			// This will be a reference to either Artist, Album, or Track
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "category",
		},
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index for preventing duplicate favorites
favoriteSchema.index({ user_id: 1, category: 1, item_id: 1 }, { unique: true });

export default model("Favorite", favoriteSchema);
