import jsonwebtoken from "jsonwebtoken";
import { ROLES } from "../config/constants.js";
import User from "../models/user.model.js";

const signup = async (userData) => {
	const userCount = await User.countDocuments();
	const role = userCount === 0 ? ROLES.ADMIN : ROLES.VIEWER;

	return await User.create({ ...userData, role });
};

const login = async (credentials) => {
	const { email, password } = credentials;
	const user = await User.findOne({ email });

	if (!user) throw new Error("User not found");

	const isMatch = await user.comparePassword(password);
	if (!isMatch) throw new Error("Invalid credentials");

	const token = jsonwebtoken.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: "24h",
	});

	return { token };
};

export default {
	signup,
	login,
};
