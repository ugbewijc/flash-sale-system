/**
 * 
 */
import { requiredField, sanitizeEmail } from './CommonValidators.js';

export const loginValidation = [
    sanitizeEmail('username', 'Invalid Username'),
    requiredField('password', 'Password is required')
];

export const adminRegisterValidation = [
    ...loginValidation,
    requiredField('name', 'Name is required'),
    requiredField('role', 'Role is required')
    .equals('admin').withMessage('Role must be admin')
];

export const customerRegisterValidation = [
    ...loginValidation,
    requiredField('name', 'Name is required')
];