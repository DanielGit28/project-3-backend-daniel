const formatRequestError = (err) => ({ error: err.name, message: err.message });

const isValidationError = (err) => err.name === "ValidationError";

module.exports = { formatRequestError, isValidationError };