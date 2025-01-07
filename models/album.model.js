import { Schema, model } from "mongoose";

const albumSchema = new Schema(
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
		year: {
			type: Number,
			required: true,
			min: 1900,
			max: new Date().getFullYear(),
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

albumSchema.index({ name: 1 });
albumSchema.index({ artist_id: 1 });
albumSchema.index({ year: 1 });
albumSchema.index({ hidden: 1 });

export default model("Album", albumSchema);
