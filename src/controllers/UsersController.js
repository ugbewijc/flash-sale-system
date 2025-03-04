/**
 * 
 */
import passport from 'passport';
import { validationResult } from 'express-validator';
import { appConfig } from '../config.js';
import { User } from '../models/Users.js';
export default class UsersController {

    static async registerUser(req, res, next) {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Valid Username and Password required',
                // error: errors.array() 
            });
        }
        const { username, password } = req.body;
        try {
            const user = new User({ username, password });
            await user.save();
            res.status(201).json({
                success: true,
                message: 'User registered successfully, please login'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Unable to register user',
                // error: err 
            });
        }
    }
    static async registerAdmin(req, res, next) {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Valid Username and Password required',
                // error: errors.array() 
            });
        }
        const { username, password, role } = req.body;
        try {
            const user = new User({ username, password, role });
            await user.save();
            res.status(201).json({
                success: true,
                message: 'Admin registered successfully, please login'
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: 'Unable to register admin',
                // error: err 
            });
        }
    }

    static async login(req, res, next) {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Valid Username and Password required',
                // error: errors.array() 
            });
        }
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error logging in',
                    // error: err 
                });
            }
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect username or password',
                    // error: info
                });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error logging in user',
                        //  error: err 
                    });
                }
                if (user.role === 'admin') {
                    return res.redirect('/api/admin/dashboard');
                }
                return res.redirect('/api/dashboard');
            });
        })(req, res, next);
    }

    static async logout(req, res, next) {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error logging out',
                    // error: err 
                });
            }
            res.cookie(appConfig.COOKIE_NAME, '', {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            return res.status(200).json({
                success: true,
                message: 'User logged out successfully'
            });
        });
    }
}