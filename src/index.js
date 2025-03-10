/**
 * 
 */
import process from 'process';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {createServer} from 'http';
import { Server } from 'socket.io';
import rateLimiterMiddleware from './middleware/rateLimit.js';
import { connectToDB } from './models/db.js';
import { appConfig } from './config.js';
import { apiRouter } from './routes/index.js';
import passportConfig from './passport.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

// Connect to MongoDB
connectToDB();

//socket event
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        socket.emit('message', `Hello from server; "${msg.data}" received`);
    });

    socket.on('socket status', () => {
        socket.emit('socket status', `Hello from server; flash sales socket is online`);
    });
});


// Middleware
app.use(rateLimiterMiddleware)
app.use(compression())
app.use(express.json());
app.use(helmet());
passportConfig(passport);

app.use(cors({
  origin: '127.0.0.1:3000',//change to the domain name in production
  credentials: true
}));

app.use(session({
  name: appConfig.COOKIE_NAME,
  secret: appConfig.SS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: appConfig.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    secure: (appConfig.ENV === 'development' ? false : true),
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api', apiRouter);


app.get('/', async (req, res) => {
  res.json({
    success: true,
    data: {
      message: `Hello, Welcome to Flash Sale System API`
    },
  });
});

// General 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errors: ['Page Not Found']
  });
});

// General error handler for uncaught errors
app.use((err, req, res) => {
  res.status(500).json({
    success: false,
    errors: ['Oops! Something went wrong!, Contact the Admin']
  });
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Index.js: Unhandled Rejection at:', promise, 'reason:', reason);
});


server.listen(appConfig.PORT, () => {
  console.log(`Server listening on port ${appConfig.PORT}`);
});

export { io}