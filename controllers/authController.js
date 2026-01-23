import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

export const renderLogin = (req, res) => res.render('login', { error: null });

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        
        req.session.userId = user._id;
        logger.info('User registered', { username });
        res.redirect('/');
    } catch (err) {
        logger.error('Registration error', { error: err.message });
        res.render('login', { error: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Set session!
            logger.info('User login successful', { username }); 
            return res.redirect('/');
        }
        
        logger.warn('Failed login attempt', { username, ip: req.ip });
        res.render('login', { error: 'Invalid credentials' });
    } catch (err) {
        logger.error('Login system error', { error: err.message });
        res.status(500).render('404');
    }
};

export const logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};