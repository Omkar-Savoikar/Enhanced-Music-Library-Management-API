import userService from "../services/user.service.js";
import responseHandler from "../utils/response.utils.js";
import validator from "../utils/validator.utils.js";

const getUsers = async (req, res) => {
	try {
		const { limit, offset, role } = req.query;
		const albums = await userService.getUsers({
			limit: parseInt(limit),
			offset: parseInt(offset),
			role: role !== undefined ? role : undefined,
		});

		return responseHandler.success(res, 200, albums, "Users fetched successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request", error);
	}
};

const addUser = async (req, res) => {
	try {
		const { error } = validator.validateUserInput(req.body);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		const existingUser = await userService.getUserbyEmail(req.body.email);
		if (existingUser) return responseHandler.error(res, 400, "Email already exist.");

		const user = await userService.createUser(req.body);
		return responseHandler.success(res, 201, null, "User created successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const updateUser = async (req, res) => {
	try {
		if (req.user._id.toString() !== req.params.id) return responseHandler.error(res, 403, "Forbidden Access");
		const { error } = validator.validateUserInput(req.body, true);
		if (error) return responseHandler.error(res, 400, "Bad Request", error.details[0].message);

		const user = await userService.updateUser(req.params.id, req.body);
		if (!user) return responseHandler.error(res, 404, "User not found.");

		return responseHandler.success(res, 204);
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const deleteUser = async (req, res) => {
	try {
		const user = await userService.deleteUser(req.params.id);
		if (!user) return responseHandler.error(res, 404, "User not found.");

		return responseHandler.success(res, 200, null, "User deleted successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

export default {
	getUsers,
	addUser,
	updateUser,
	deleteUser,
};
