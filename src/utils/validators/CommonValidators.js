import { body, query } from "express-validator";

export function ids(field) {
    return body(field)
        .isMongoId().withMessage('Invalid ID');
}

// export function validStatus(field){
//     const status = ['pending','active', 'pause', 'sold out', 'close'];
//     return body(field)
//     .default('pending')
//     .isIn(status).withMessage('Invalid product status');
// }


/**
 * Checks if a field is a valid ISO8601 date.
 * @param {string} field - The name of the field to check.
 * @returns {ValidationChain} The validation chain.
 */

export function validDate(field) {
    return body(field)
        .toDate()
}

/**
 * Cleans a field by trimming, escaping, and converting it to lower case.
 * @param {string} field - The name of the field to clean.
 * @returns {ValidationChain} The validation chain.
 */

export function cleanField(field) {
    return body(field)
        .trim()
        .escape()
        .isString().withMessage('Field must be a string')
        .toLowerCase();
}
/**
 * Checks if a field is required by first cleaning the field and then ensuring it is not empty.
 * @param {string} field - The name of the field to check.
 * @param {string} message - The error message to display if the field is empty.
 * @returns {ValidationChain} The validation chain.
 */
export function requiredField(field, message) {
    return cleanField(field).notEmpty().withMessage(message)
}

export function sanitizeEmail(field, message) {
    return body(field)
        .isEmail().withMessage(message)
        .normalizeEmail()
}

export const validateDateRange = [
    query('from')
        .optional()
        .toDate()
        .isISO8601().withMessage('The FROM date must be a valid date in YYYY-MM-DD format'),
    query('to')
        .optional()
        .toDate()
        .isISO8601().withMessage('The TO date must be a valid date in YYYY-MM-DD format'),
    query('to')
        .optional()
        .custom((to, { req }) => {
            if (new Date(to) < new Date(req.query.from)) {
                throw new Error('TO date must be after or equal to FROM date');
            }
            return true;
        })
];
