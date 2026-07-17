// src/config/env.config.js
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  MONGO_URI: z.string().url({ message: "MONGO_URI must be a valid connection string." }),
  JWT_SECRET: z.string().min(32, { message: "JWT_SECRET must be at least 32 characters long." }),
  JWT_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'), // 15 mins
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default('100')
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('❌ Invalid Environment Configuration Variables:', JSON.stringify(envParse.error.format(), null, 2));
  process.exit(1);
}

export const env = envParse.data;