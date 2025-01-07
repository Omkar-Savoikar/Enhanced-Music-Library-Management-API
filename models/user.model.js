import bcryptjs from "bcryptjs";
import { Schema, model } from "mongoose";

import { ROLES } from "../config/constants.js";

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			enum: Object.values(ROLES),
			default: "viewer",
		},
	},
	{
		timestamps: true,
	},
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcryptjs.hash(this.password, 10);
	}
	next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcryptjs.compare(candidatePassword, this.password);
};

export default model("User", userSchema);
