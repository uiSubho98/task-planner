class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[],
    public stack?: string,
    public success?: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors || [];

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export { ApiError };
