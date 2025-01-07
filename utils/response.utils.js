const success = (res, status, data = null, message = "") => {
	return res.status(status).json({
		status,
		data,
		message,
		error: null,
	});
};

const error = (res, status, message = "", error = null) => {
	return res.status(status).json({
		status,
		data: null,
		message,
		error,
	});
};

export default {
	success,
	error,
};
