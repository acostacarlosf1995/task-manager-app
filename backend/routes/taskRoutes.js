const express = require('express');
const router = express.Router();
const {body, param, query} = require('express-validator'); // Añadir param para :id
const {validate} = require('../middleware/validationMiddleware');
const {protect} = require('../middleware/authMiddleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskById,
} = require('../controllers/taskController');

const taskValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is mandatory.')
        .isLength({min: 3}).withMessage('Title must be at least 3 characters long.'),
    body('description')
        .optional()
        .trim(),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status. Allowed values: pending, in-progress, completed.'),
    body('dueDate')
        .optional()
        .isISO8601().toDate().withMessage('Due date must be a valid date (YYYY-MM-DD).'),
];

const mongoIdValidationRule = [
    param('id').isMongoId().withMessage('Invalid task ID.')
];

const paginationValidationRules = [
    query('page')
        .optional()
        .isInt({min: 1}).withMessage('The "page" parameter must be a positive integer.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({min: 1, max: 100}).withMessage('The "limit" parameter must be an integer between 1 and 100.')
        .toInt(),
];

router.route('/')
    .post(protect, taskValidationRules, validate, createTask)
    .get(protect, paginationValidationRules, validate, getTasks);

router.route('/:id')
    .get(protect, mongoIdValidationRule, validate, getTaskById)
    .put(protect, mongoIdValidationRule, taskValidationRules, validate, updateTask)
    .delete(protect, mongoIdValidationRule, validate, deleteTask);

module.exports = router;