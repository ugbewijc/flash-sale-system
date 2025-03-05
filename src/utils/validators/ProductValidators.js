/**
 * 
 */
import { cleanField, requiredField, validDate, validStatus } from './CommonValidators.js';

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
        .isInt({ min: 0, max: 200 }).withMessage('Available Product quantity must be greater than 0 and less than 200'),
    //product minimum order quantity
    cleanField('moq')
        .default(5)
        .toInt()
        .isInt({ min: 0, max: 200 }).withMessage('Product Minimum Order Quantity must be greater than 0 and less than 200'),
    // product sales start time
    validDate('start_time'),
    //product status
    validStatus('status')
]