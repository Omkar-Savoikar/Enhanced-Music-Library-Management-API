import { Schema, model } from "mongoose";

const artistSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		grammy: {
			type: Number,
			default: 0,
			min: 0,
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

artistSchema.index({ name: 1 });
artistSchema.index({ grammy: 1 });
artistSchema.index({ hidden: 1 });

export default model("Artist", artistSchema);
