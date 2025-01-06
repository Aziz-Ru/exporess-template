import { NextFunction, Request, Response } from "express";
import htttpStatus from "http-status";
import env from "../config/env";
import ApiError from "../utils/ApiError";

// Error converter middleware.
export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || htttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error.message || htttpStatus[htttpStatus.INTERNAL_SERVER_ERROR];
    error = new ApiError(statusCode, message, false, error.stack);
  }
  console.log("Error Convert");
  next(error);
};

// Error handler middleware.
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;
  console.log(statusCode, message);
  if (env.NODE_ENV == "production" && !err.isOperational) {
    statusCode = htttpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal server error";
  }

  //   res.locals.errorMessage = err.message;
  const errors = [
    {
      code: statusCode,
      message,
    },
  ];
  res.status(statusCode).json({ errors });
};
