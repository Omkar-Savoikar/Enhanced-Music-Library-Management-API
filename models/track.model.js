import { Schema, model } from "mongoose";

const trackSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		artist_id: {
			type: Schema.Types.ObjectId,
			ref: "Artist",
			required: true,
		},
		album_id: {
			type: Schema.Types.ObjectId,
			ref: "Album",
			required: true,
		},
		duration: {
			type: Number,
			required: true,
			min: 1,
		},
		hidden: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

trackSchema.index({ name: 1 });
trackSchema.index({ artist_id: 1 });
trackSchema.index({ album_id: 1 });

export default model("Track", trackSchema);
