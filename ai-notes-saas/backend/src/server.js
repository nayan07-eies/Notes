// src/server.js
import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.config.js';

const PORT = env.PORT;

async function bootstrap() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGO_URI);
    console.log('⚡ [Database]: Native MongoDB Mongoose layer connected securely.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 [Server]: Operating in pure JS on port ${PORT} within [${env.NODE_ENV}] profile.`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down server runtime gracefully...');
      console.error(err.name, err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('❌ Failed to hook database dependencies:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! System terminating execution stack...');
  console.error(err.name, err.message);
  process.exit(1);
});

bootstrap();