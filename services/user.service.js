import User from "../models/user.model.js";

const getUsers = async ({ limit = 5, offset = 0, role }) => {
	const users = await User.find().sort({ name: 1 }).skip(offset).limit(limit).select("-__v");

	if (role) return users.filter((user) => user.role === role);

	return users;
};

const getUserbyEmail = async (email) => {
	return await User.findOne({ email });
};

const createUser = async (userData) => {
	return await User.create(userData);
};

const updateUser = async (id, userData) => {
	return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
};

const deleteUser = async (id) => {
	return await User.findByIdAndDelete(id);
};

export default {
	getUsers,
	getUserbyEmail,
	createUser,
	updateUser,
	deleteUser,
};
