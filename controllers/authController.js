import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

// Renders the login page
export const renderLogin = (req, res) => res.render('login', { error: null });

// Renders the separate registration page
export const renderRegister = (req, res) => res.render('register', { error: null });

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Check for existing user to provide a specific error message
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('register', { error: 'Username unavailable' });
        }

        // 2. Create and Save (Mongoose middleware handles hashing)
        const user = new User({ username, password });
        await user.save();
        
        // 3. Log user in automatically after registration
        req.session.userId = user._id;
        logger.info('User registered and logged in', { username });
        res.redirect('/');
    } catch (err) {
        logger.error('Registration error', { error: err.message });
        // Return to register page on failure, not login
        res.render('register', { error: 'Registration failed. Please try again.' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // 4. Improved Security: Use a generic error message
        // This prevents attackers from knowing if the username exists
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            logger.info('User login successful', { username }); 
            return res.redirect('/');
        }
        
        logger.warn('Failed login attempt', { username, ip: req.ip });
        res.render('login', { error: 'Username or password incorrect' });
    } catch (err) {
        logger.error('Login system error', { error: err.message });
        res.status(500).render('404');
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) logger.error('Logout error', { error: err.message });
        res.clearCookie('connect.sid'); // Clean up the session cookie
        res.redirect('/login');
    });
};