const express = require('express');
const router = express.Router();
const {body, param} = require('express-validator');
const {validate} = require('../middleware/validationMiddleware');
const {protect} = require('../middleware/authMiddleware');
const {getTasksByProject} = require('../controllers/taskController');
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

const projectValidationRules = [
    body('name')
        .trim()
        .not().isEmpty().withMessage('The project name is mandatory.')
        .isLength({min: 2}).withMessage('The project name must be at least 2 characters long.'),
    body('description').optional().trim()
];

const mongoIdValidationRule = [
    param('id').isMongoId().withMessage('Invalid project ID.')
];

router.route('/')
    .post(protect, projectValidationRules, validate, createProject)
    .get(protect, getProjects);

router.route('/:id')
    .get(protect, mongoIdValidationRule, validate, getProjectById)
    .put(protect, mongoIdValidationRule, projectValidationRules, validate, updateProject)
    .delete(protect, mongoIdValidationRule, validate, deleteProject);

router.get('/:id/tasks', protect, mongoIdValidationRule, validate, getTasksByProject);

module.exports = router;