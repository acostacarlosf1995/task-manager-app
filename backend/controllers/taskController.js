const Task = require('../models/Task');

const createTask = async (req, res) => {
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
        console.error('Error creating task:', error);
        const statusCode = res.statusCode === 200 ? (error.name === 'ValidationError' ? 400 : 500) : res.statusCode;
        res.status(statusCode).json({message: error.message});
    }
}

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user._id}).sort({createdAt: -1});
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({message: 'Server error fetching tasks'});
    }
}

const updateTask = async (req, res) => {
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
        console.error('Error updating task:', error);
        const statusCode = res.statusCode === 200 ? (error.name === 'ValidationError' ? 400 : 500) : res.statusCode;
        res.status(statusCode).json({message: error.message});
    }
}

const deleteTask = async (req, res) => {
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
        console.error('Error deleting task:', error);
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({message: error.message});
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}