import { body } from 'express-validator';

export const registerValidation = [
    body('username')
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail().withMessage('Invalid Username')
        .notEmpty().withMessage('Username is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

export const adminRegisterValidation = [
    ...registerValidation,
    body('role')
        .trim()
        .escape()
        .notEmpty().withMessage('Role is required')
        .toLowerCase()
        .equals('admin').withMessage('Role must be admin')
];

export const loginValidation = [
    body('username')
        .trim()
        .escape()
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Please enter a valid Username'),
    body('password')
        .notEmpty().withMessage('Password is required'),
];