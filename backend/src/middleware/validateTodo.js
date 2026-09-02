import { body, param, validationResult } from 'express-validator';

const statusOptions = ['todo', 'in_progress', 'completed', 'archived'];
const priorityOptions = ['low', 'medium', 'high', 'urgent'];

export const validateTodoPayload = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 1, max: 120 }).withMessage('Title must be between 1 and 120 characters'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }).withMessage('Description must be 2000 characters or less'),
  body('status').optional().isIn(statusOptions).withMessage(`Status must be one of: ${statusOptions.join(', ')}`),
  body('priority').optional().isIn(priorityOptions).withMessage(`Priority must be one of: ${priorityOptions.join(', ')}`),
  body('due_date').optional({ values: 'null' }).matches(/^\d{4}-\d{2}-\d{2}(T.*)?$/).withMessage('Due date must be in YYYY-MM-DD format'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('category').optional().isString().trim(),
  body('estimated_time').optional().isString().trim(),
  body('notes').optional().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: errors.array().map((error) => ({ field: error.path, message: error.msg })),
      });
    }
    next();
  },
];

export const validateTodoId = [
  param('id').isInt({ min: 1 }).withMessage('Todo ID must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID',
        details: errors.array().map((error) => ({ field: error.path, message: error.msg })),
      });
    }
    next();
  },
];
