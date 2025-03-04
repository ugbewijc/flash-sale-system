import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectToDB } from './models/db.js';
import { appConfig } from './config.js';
import { apiRouter } from './routes/index.js';
// import  passportConfig  from './passport.js';
import passportConfig  from './passport.js';

const app = express();

// Connect to MongoDB
connectToDB();

// Middleware
app.use(express.json());
passportConfig(passport);

app.use(cors({
  origin: 'http://localhost:3000',//chage to the domain name in production
  credentials: true
}));

app.use(session({
  name: appConfig.COOKIE_NAME,
    secret: appConfig.SS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: appConfig.MONGO_URI }),
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


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Hello, Welcome to Flash Sale System API`,
  });
});

// General 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Not Found'
   });
});


// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Index.js: Unhandled Rejection at:', promise, 'reason:', reason);
});
// General error handler for uncaught errors
app.use((err, req, res,next) => {
  res.status(500).json({ message: 'Oops! Something went wrong!, Contact the Admin' });
});

app.listen(appConfig.PORT, () => {
  console.log('Server listening on port 3000');
});