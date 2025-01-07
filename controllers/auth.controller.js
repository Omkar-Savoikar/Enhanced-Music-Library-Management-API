import authService from "../services/auth.service.js";
import responseHandler from "../utils/response.utils.js";
import validator from "../utils/validator.utils.js";

const signup = async (req, res) => {
	try {
		const { error } = validator.validateSignupInput(req.body);
		if (error) {
			const errorDetails = error.details[0].message.split(" ")[0];
			return responseHandler.error(res, 400, `Bad Request, Reason: Missing ${errorDetails}`, null);
		}

		await authService.signup(req.body);
		return responseHandler.success(res, 201, null, "User created successfully.");
	} catch (error) {
		if (error.code === 11000) {
			return responseHandler.error(res, 409, "Email already exists.");
		}
		return responseHandler.error(res, 400, "Bad Request");
	}
};

const login = async (req, res) => {
	try {
		const { error } = validator.validateLoginInput(req.body);
		if (error) {
			const errorDetails = error.details[0].message.split(" ")[0];
			return responseHandler.error(res, 400, `Bad Request, Reason: ${errorDetails} missing`, null);
		}

		const token = await authService.login(req.body);
		return responseHandler.success(res, 200, token, "Login successful");
	} catch (error) {
		return responseHandler.error(res, 404, "User not found.");
	}
};

const logout = async (req, res) => {
	try {
		// Implement token blacklisting if needed
		return responseHandler.success(res, 200, null, "User logged out successfully.");
	} catch (error) {
		return responseHandler.error(res, 400, "Bad Request");
	}
};

export default {
	signup,
	login,
	logout,
};
