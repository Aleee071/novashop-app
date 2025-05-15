class ApiError extends Error {
	constructor(
		message = "Something went wrong!",
		status = 500, // Provide a default status code
		errors = []
	) {
		super(message);

		this.status = status;
		this.errors = errors;
		this.data = null;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default ApiError;
