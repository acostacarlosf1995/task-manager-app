const Task = require('../models/Task');

const createTask = async (req, res, next) => {
    try {
        const {title, description, status, dueDate} = req.body;

        if (!title) {
            return res.status(400).json({message: 'Title for task is mandatory'});
        }

        const task = await Task.create({
            user: req.user._id,
            title,
            description,
            status,
            dueDate,
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}

const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({user: req.user._id}).sort({createdAt: -1});
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const {title, description, status, dueDate} = req.body;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'user not authorized to update this task'});
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error)
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'User not authorized to delete this task'});
        }

        await Task.findByIdAndDelete(taskId);

        res.status(200).json({message: 'Task deleted successfully', id: taskId});
    } catch (error) {
        next(error)
    }
}

const getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'User not authorized to view this task'});
        }

        res.status(200).json(task);

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskById,
}