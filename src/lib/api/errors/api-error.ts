/**
 * Base API error with HTTP status code
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 400 Bad Request */
export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

/** 404 Not Found */
export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

/** 409 Conflict */
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
  }
}
