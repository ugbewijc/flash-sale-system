/**
 * 
 */
import mongoose from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import { appConfig } from '../config.js';

mongoose.connect(appConfig.MONGO_URI);
const rateLimiter = new RateLimiterMongo({
  // mongoUrl: appConfig.MONGO_URI,
  storeClient: mongoose.connection.getClient(),
  // dbName: appConfig.MONGO_DB_NAME,
  tableName: 'rateLimits',
  points: 10,// Maximum number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // block requests for a given sec when points are consumed
});

export default async function rateLimiterMiddleware(req, res, next) {
  try {
    const key = req.user ? req.user.username : req.ip;
   await rateLimiter.consume(key);
    next();
  } catch (rateLimiterRes) {
    // eslint-disable-next-line no-console
    console.log(rateLimiterRes)
    res.status(429).json({
      success: false,
      errors: ['Too Many Requests. Please try again later.']
    });
  }
};
