// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.config.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { AppError } from './utils/appError.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: true, // Auto-aligns dynamically with your Axios front-end calls
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use(rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: { status: 'fail', message: 'Too many requests from this IP. Please wait.' }
}));

// API Base Probe
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Unknown Path Fallback
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server environment.`, 404));
});

app.use(globalErrorHandler);

export default app;