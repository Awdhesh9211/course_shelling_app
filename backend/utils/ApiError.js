export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // optional extra info (like Zod issues)
    Error.captureStackTrace(this, this.constructor);
  }
}
