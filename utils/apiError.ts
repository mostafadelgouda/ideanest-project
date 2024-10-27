// @desc The class is responsible for operation errors (predicted errors)
class ApiError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Set the prototype explicitly to maintain the instance of the Error class
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
