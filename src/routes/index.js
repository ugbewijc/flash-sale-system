/**
 * 
 */
import express from 'express';
import { ensureAuthenticated, ensureAdmin, redirectIfAuthenticated } from '../middleware/auth.js';
import { loginValidation, adminRegisterValidation, customerRegisterValidation } from '../utils/validators/UsersValidators.js';
import { productValidation, cartValidation } from '../utils/validators/ProductValidators.js';
import { validateDateRange } from '../utils/validators/CommonValidators.js';
import { ids } from '../utils/validators/CommonValidators.js';
import UsersController from '../controllers/UsersController.js';
import ProductController from '../controllers/ProductController.js';
import SalesController from '../controllers/SalesController.js';

export const router = express.Router();

/**
 * Common Routes
 */
router.post('/login', redirectIfAuthenticated, loginValidation, UsersController.login);
router.get('/logout', UsersController.logout);
router.post('/register', customerRegisterValidation, UsersController.registerCustomer);
router.post('/admin/register', adminRegisterValidation, UsersController.registerAdmin);


/**
 *  Customer Route
 */
router.get('/products',ProductController.getAllProducts)
router.get('/products/:name', ids('id'), ProductController.getProduct);

// Restricted

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            // "id": req.user.id,
            "name": req.user.name,
            "username": req.user.username
        }
    });
});

router.post('/cart', ensureAuthenticated, cartValidation, ProductController.salesCart);


/**
 * Restricted Admin Route
 */

router.get('/admin/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            "name": req.user.name,
            "username": req.user.username
        }
    });
})

router.get('/admin/leaderboard', ensureAuthenticated, ensureAdmin,validateDateRange, SalesController.leaderboard);
router.get('/admin/leaderboard/customer', ensureAuthenticated, ensureAdmin, ids('id'),validateDateRange, SalesController.leaderboardByCustomer);
router.get('/admin/leaderboard/products', ensureAuthenticated, ensureAdmin, ids('id'),validateDateRange, SalesController.leaderboardByProduct);

router.get('/admin/products',ensureAuthenticated, ensureAdmin, ProductController.getAllProducts);
router.get('/admin/products/:name',ensureAuthenticated, ensureAdmin, ids('id'), ProductController.getProduct);
router.post('/admin/products',ensureAuthenticated, ensureAdmin, productValidation, ProductController.newProduct);
router.put('/admin/products/',ensureAuthenticated, ensureAdmin, ids('id'), productValidation, ProductController.updateProduct);


export { router as apiRouter };