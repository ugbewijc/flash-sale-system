/**
 * 
 */

export const appConfig = {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/dev-db-flash-sale-system',
    SS_SECRET: process.env.SS_SECRET || 'secret',
    COOKIE_NAME: process.env.COOKIE_NAME || 'flash-sale'
}