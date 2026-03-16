import { body, validationResult } from 'express-validator';

/**
 * Handle validation results — returns errors to the caller
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect('back');
  }
  next();
}

/**
 * Registration validation rules
 */
export const validateRegistration = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .escape(),
  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .escape(),
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
  body('account_type')
    .isIn(['user', 'company']).withMessage('Please select a valid account type.'),
  handleValidationErrors,
];

/**
 * Login validation rules
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

/**
 * Review validation rules
 */
export const validateReview = [
  body('content')
    .trim()
    .notEmpty().withMessage('Review content is required.')
    .isLength({ min: 10 }).withMessage('Review must be at least 10 characters long.')
    .escape(),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('review_type')
    .isIn(['course', 'consulting']).withMessage('Invalid review type.'),
  handleValidationErrors,
];

/**
 * Ticket validation rules
 */
export const validateTicket = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ max: 255 }).withMessage('Subject must be less than 255 characters.')
    .escape(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters long.')
    .escape(),
  body('category')
    .isIn(['course', 'consulting', 'account', 'other']).withMessage('Please select a valid category.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level.'),
  handleValidationErrors,
];

/**
 * Consultation request validation rules
 */
export const validateConsultation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 255 }).withMessage('Title must be less than 255 characters.')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters long.')
    .escape(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level.'),
  handleValidationErrors,
];

/**
 * News article validation rules
 */
export const validateArticle = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .escape(),
  body('summary')
    .trim()
    .optional()
    .escape(),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required.'),
  body('category')
    .isIn(['cyber_world', 'articles', 'course_news']).withMessage('Invalid category.'),
  handleValidationErrors,
];
