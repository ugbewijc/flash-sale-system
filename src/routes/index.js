import express from 'express';
import { ensureAuthenticated, ensureAdmin, redirectIfAuthenticated } from '../middleware/auth.js';
import { loginValidation, registerValidation, adminRegisterValidation } from '../utils/validators/UsersValidators.js';
import { productValidation } from '../utils/validators/ProductValidators.js';
import { ids } from '../utils/validators/CommonValidators.js';
import UsersController from '../controllers/UsersController.js';
import ProductController from '../controllers/ProductController.js';

export const router = express.Router();

/**
 * Common Routes
 */
router.post('/login', redirectIfAuthenticated, loginValidation, UsersController.login);
router.get('/logout', UsersController.logout);
router.post('/register', registerValidation, UsersController.registerUser);
router.post('/admin/register', adminRegisterValidation, UsersController.registerAdmin);


/**
 * Restricted Customer Route
 */

router.use(ensureAuthenticated);//ensureAuthenticated

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard', user: req.user });
    return next(err);
});


/**
 * Restricted Admin Route
 */

router.use(ensureAdmin); //, ensureAuthenticated, ensureAdmin

router.get('/admin/dashboard', async (req, res) => {
    return res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
    // return next(err);
})

router.get('/admin/products', ProductController.getAllProducts);
router.get('/admin/products/:name', ids('id'), ProductController.getProduct);
router.post('/admin/products', productValidation, ProductController.newProduct);
router.put('/admin/products/',ids('id'), productValidation, ProductController.updateProduct);

export { router as apiRouter };