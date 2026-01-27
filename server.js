import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todo.js';
import { protect } from './middleware/authMiddleware.js';
import { logger } from './utils/logger.js';

dotenv.config();
const app = express();

// TRUST PROXY (Crucial for Render/Production)
// This allows Express to trust the X-Forwarded-Proto header for secure cookies
app.set('trust proxy', 1); 

// Security and Middleware
app.use(helmet({
    contentSecurityPolicy: false, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// UPDATED SESSION SETUP
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: { 
        // Must be true on Render (Production) to send over HTTPS
        secure: process.env.NODE_ENV === 'production', 
        // Helps prevent CSRF and required for secure cookies on many proxies
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Logging Middleware
app.use((req, res, next) => {
    logger.info('Incoming Request', { 
        method: req.method, 
        path: req.path, 
        ip: req.ip 
    });
    next();
});

// Routes
app.use('/', authRoutes);
app.get('/', protect, (req, res) => res.render('index'));
app.use('/api/todos', todoRoutes);

// 404 Handler
app.use((req, res) => res.status(404).render('404'));

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled Exception', { message: err.message, stack: err.stack });
    res.status(500).render('404');
});

// Database connection logic
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            // Logic note: Mongoose uses the DB name specified in your URI string
            logger.info('Connected to MongoDB');
            app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
        })
        .catch(err => {
            logger.error('Database connection failed', { error: err.message });
            process.exit(1);
        });
}

export default app;