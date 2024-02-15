class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[],
    public stack?: string,
    public data?: any,
    public success?: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data || null;
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
