class ApiResponse {
    constructor(
        public statusCode: number,
        public message: string,
        public data?: any,
        public success?: boolean
      ){
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message);
    this.success = true;
  }
}

export { ApiResponse };
