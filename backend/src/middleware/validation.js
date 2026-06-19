import { body, validationResult } from 'express-validator';

// Utility middleware to check validation results and format error messages
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validate and sanitize Popup Leads
export const validatePopupLead = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required'),
  body('phone')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail(),
  checkValidationResult
];

// Validate and sanitize Enquiries
export const validateEnquiry = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required'),
  body('phone')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail(),
  body('enquiryType')
    .trim()
    .escape()
    .isIn(['farmer', 'buyer', 'investor', 'contact'])
    .withMessage('Invalid enquiry type'),
  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('state')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('State is required'),
  body('district')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('District is required'),
  body('cityVillage')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('pincode')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Pincode is required'),
  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  checkValidationResult
];

// Validate and sanitize Reviews
export const validateReview = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required'),
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('review')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Review text is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer value between 1 and 5.')
    .toInt(),
  checkValidationResult
];

// Validate and sanitize Admin Login Credentials
export const validateLogin = [
  body('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  checkValidationResult
];

// Validate Visitor Creation
export const validateVisitorCreate = [
  body('sessionId')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Session ID is required'),
  body('languageSelected')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 10 }),
  body('pagesVisited')
    .optional()
    .custom((val) => {
      if (val && !Array.isArray(val) && typeof val !== 'string') {
        throw new Error('pagesVisited must be a string or an array');
      }
      return true;
    }),
  body('categoryVisited')
    .optional()
    .custom((val) => {
      if (val && !Array.isArray(val) && typeof val !== 'string') {
        throw new Error('categoryVisited must be a string or an array');
      }
      return true;
    }),
  checkValidationResult
];

// Validate Visitor Session Updates
export const validateVisitorUpdate = [
  body('languageSelected')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 10 }),
  body('pagesVisited')
    .optional()
    .custom((val) => {
      if (val && typeof val !== 'string' && typeof val !== 'object') {
        throw new Error('pagesVisited must be a string or an object');
      }
      return true;
    }),
  body('categoryVisited')
    .optional()
    .custom((val) => {
      if (val && typeof val !== 'string' && typeof val !== 'object') {
        throw new Error('categoryVisited must be a string or an object');
      }
      return true;
    }),
  checkValidationResult
];
