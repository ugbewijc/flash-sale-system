/**
 * 
 */
import passport from 'passport';
import { validationResult, matchedData } from 'express-validator';
import { appConfig } from '../config.js';
import { User } from '../models/Users.js';
export default class UsersController {

    static async registerCustomer(req, res) {
        try {
            const missingFields = ['name', 'username', 'password'].filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw {
                    code: 400,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                }
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                const errorMessages = errors.array().map(({ msg }) => msg);

                throw {
                    code: 400,
                    errors: errorMessages
                }
            }
            const data = matchedData(req, { locations: ['body'] });
            const existingUsers = await User.exists({ username: data.username });
            if (existingUsers) {
                throw {
                    code: 400,
                    errors: ['Username already exists']
                }
            }

            const user = new User(data);
            await user.save();

            res.status(201).json({
                success: true,
                data: {
                    message: 'User registered successfully, please login'
                }
            });
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to Register Customer']
            });
        }
    }
    static async registerAdmin(req, res) {
        try {
            const missingFields = ['name', 'username', 'password', 'role'].filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw {
                    code: 400,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                }
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                const errorMessages = errors.array().map(({ msg }) => msg);

                throw {
                    code: 400,
                    errors: errorMessages
                }
            }
            const data = matchedData(req, { locations: ['body'] });
            const existingUsers = await User.exists({ username: data.username });
            if (existingUsers) {
                throw {
                    code: 400,
                    errors: ['Username already exists']
                }
            }
            const user = new User(data);
            await user.save();
            res.status(201).json({
                success: true,
                data: {
                    message: 'Admin registered successfully, please login'
                }
            });
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to Register Customer']
            });
        }
    }

    static async login(req, res, next) {
        try {
            const missingFields = ['username', 'password'].filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw {
                    code: 400,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                }
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                return res.status(400).json({
                    success: false,
                    errors: errorMessages
                });
            }
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to Register Customer']
            });
        }

        passport.authenticate('local', (err, user) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    errors: ['Error logging in'] //err 
                });
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: ['Incorrect username or password'] //info
                });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        errors: ['Error logging in user'] //err
                    });
                }
                if (user.role === 'admin') {
                    return res.redirect('/api/admin/dashboard');
                }
                return res.redirect('/api/dashboard');
            });
        })(req, res, next);
    }

    static async logout(req, res) {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    errors: ['Error logging out']// err
                });
            }
            res.cookie(appConfig.COOKIE_NAME, '', {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            return res.status(200).json({
                success: true,
                data: {
                    message: 'User logged out successfully'
                }
            });
        });
    }
}