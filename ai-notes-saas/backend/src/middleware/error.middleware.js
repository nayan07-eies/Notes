// src/middleware/error.middleware.js
import { env } from '../config/env.config.js';

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad Object ID (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // Handle Mongoose Duplicate Keys
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate resource field value entered: ${Object.keys(err.keyValue).join(', ')}`;
  }

  // Handle Zod Schema Validation Errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Failure',
      errors: err.errors
    });
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};