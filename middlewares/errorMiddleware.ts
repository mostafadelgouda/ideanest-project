import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  statusCode?: number;
  status?: string;
}

const globalErrorHandling = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorForDev(err, res);
  } else {
    return sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err: ApiError, res: Response): Response => {
  return res.status(err.statusCode!).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err: ApiError, res: Response): Response => {
  return res.status(err.statusCode!).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandling;
