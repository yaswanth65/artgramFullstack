import { Request, Response, NextFunction } from 'express';

// Use CommonJS require at runtime so destructuring matches the actual exported
// shape of the installed express-validator package (avoids default import issues).
// Avoid importing the package's types because the installed @types may not match
// the runtime package version; use a local alias for ValidationChain instead.
const expressValidator = require('express-validator');
const { body, validationResult } = expressValidator;
type ValidationChain = any;

// Generic validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  };
};

// User validation rules
export const userValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Must be a valid phone number'),
    body('role')
      .optional()
      .isIn(['admin', 'branch_manager', 'customer'])
      .withMessage('Role must be admin, branch_manager, or customer')
  ];
};

// Product validation rules
export const productValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters')
      .trim()
      .escape(),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
      .trim()
      .escape(),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    // Note: stock removed from product model — inventory tracking not supported here
    body('category')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Category must not exceed 50 characters')
      .trim()
      .escape(),
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be a positive number'),
    body('sku')
      .optional()
      .isAlphanumeric()
      .withMessage('SKU must contain only letters and numbers')
  ];
};

// Booking validation rules
export const bookingValidationRules = () => {
  return [
    body('customerName')
      .isLength({ min: 2, max: 50 })
      .withMessage('Customer name must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('customerEmail')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('customerPhone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Must be a valid phone number'),
    body('seats')
      .isInt({ min: 1, max: 10 })
      .withMessage('Seats must be between 1 and 10'),
    body('date')
      .isISO8601()
      .withMessage('Date must be in valid ISO format')
  .custom((value: string) => {
        const bookingDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
          throw new Error('Booking date cannot be in the past');
        }
        return true;
      }),
    body('time')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Time must be in HH:MM format'),
    body('specialRequests')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Special requests must not exceed 200 characters')
      .trim()
      .escape()
  ];
};

// Session validation rules
export const sessionValidationRules = () => {
  return [
    body('date')
      .isISO8601()
      .withMessage('Date must be in valid ISO format')
  .custom((value: string) => {
        const sessionDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (sessionDate < today) {
          throw new Error('Session date cannot be in the past');
        }
        return true;
      }),
    body('activity')
      .isIn(['slime', 'tufting'])
      .withMessage('Activity must be either slime or tufting'),
    body('time')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Time must be in HH:MM format'),
    body('totalSeats')
      .isInt({ min: 1, max: 50 })
      .withMessage('Total seats must be between 1 and 50'),
    body('type')
      .isLength({ min: 2, max: 50 })
      .withMessage('Type must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('ageGroup')
      .isLength({ min: 1, max: 10 })
      .withMessage('Age group must be between 1 and 10 characters')
      .trim()
      .escape(),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
  ];
};

// Login validation rules
export const loginValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password is required')
  ];
};
