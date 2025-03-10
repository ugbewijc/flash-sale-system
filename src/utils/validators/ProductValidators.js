/**
 * 
 */
import { check} from 'express-validator';
import { cleanField, requiredField, validDate } from './CommonValidators.js';

export const productValidation = [
    // product name
    requiredField('name', 'Product name is required'),
    //product description
    cleanField('description')
        .optional(),
    //product price
    requiredField('price', 'Product price is required')
        .toFloat()
        .isFloat({ gt: 0 }).withMessage('Product price must be greater than 0'),
    //product quantity
    requiredField('quantity', 'Available Product quantity is required')
        .toInt()
        .isInt({ min: 0, max: 200 }).withMessage('Available Product quantity must be between 0 and 200'),
    //product minimum order quantity
    cleanField('moq')
        .default(5)
        .toInt()
        .isInt({ min: 0, max: 200 }).withMessage('Product Minimum Order Quantity must be between 0 and 200'),
    // product sales start time
    validDate('start_time')
]

export const cartValidation = [
    check('cart').isArray({ min: 1 }).withMessage('Cart must not be an empty array'),
    check('cart.*.product_id').isMongoId().withMessage('Invalid Product ID'),
    check('cart.*.quantity').isInt({ min: 1, max: 200 }).withMessage('Quantity must be between 0 and 200')
]