const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {createTask, getTasks, updateTask, deleteTask, getTaskById} = require('../controllers/taskController');

router.route('/')
    .post(protect, createTask)
    .get(protect, getTasks);

router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;