import jsonwebtoken from "jsonwebtoken";

import User from "../models/user.model.js";
import ResponseHandler from "../utils/response.utils.js";

const authenticate = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) return ResponseHandler.error(res, 401, "Unauthorized Access");

		const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user) return ResponseHandler.error(res, 401, "Unauthorized Access");

		req.user = user;
		next();
	} catch (error) {
		return ResponseHandler.error(res, 401, "Unauthorized Access");
	}
};

const authorize = (roles = []) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) return ResponseHandler.error(res, 403, "Forbidden Access");
		next();
	};
};

export default {
	authenticate,
	authorize,
};
