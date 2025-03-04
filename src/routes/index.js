import express from 'express';
import { ensureAuthenticated, ensureAdmin, redirectIfAuthenticated } from '../middleware/auth.js';
import { loginValidation, registerValidation, adminRegisterValidation } from '../utils/validators/UsersValidators.js';
import UsersController from '../controllers/UsersController.js';

export const router = express.Router();

router.post('/register', registerValidation, UsersController.registerUser);
router.post('/login',redirectIfAuthenticated, loginValidation, UsersController.login);
router.get('/logout', UsersController.logout);

router.post('/admin/register', adminRegisterValidation, UsersController.registerAdmin);
router.get('/admin/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
    return res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
    // return next(err);
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard', user: req.user });
    return next(err);
});

export { router as apiRouter };