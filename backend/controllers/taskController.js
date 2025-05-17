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
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Objeto de Filtros
        const filters = {user: req.user._id};

        // Filtrar por estado (status)
        if (req.query.status) {
            const allowedStatuses = Task.schema.path('status').enumValues;
            if (allowedStatuses.includes(req.query.status)) {
                filters.status = req.query.status;
            }
        }

        // Filtrar por fecha de vencimiento (dueDate)
        // if (req.query.dueDate) {
        //     const dateParam = req.query.dueDate;
        //
        //     const startOfDay = new Date(Date.UTC(
        //         parseInt(dateParam.substring(0, 4), 10),
        //         parseInt(dateParam.substring(5, 7), 10) - 1,
        //         parseInt(dateParam.substring(8, 10), 10),
        //         0, 0, 0, 0
        //     ));
        //
        //     if (!isNaN(startOfDay.getTime())) {
        //         const endOfDay = new Date(startOfDay);
        //         endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);
        //         endOfDay.setUTCHours(0, 0, 0, -1);
        //
        //         const endOfDayCorrected = new Date(Date.UTC(
        //             startOfDay.getUTCFullYear(),
        //             startOfDay.getUTCMonth(),
        //             startOfDay.getUTCDate(),
        //             23, 59, 59, 999
        //         ));
        //
        //         filters.dueDate = {$gte: startOfDay, $lte: endOfDayCorrected};
        //     }
        // }

        if (req.query.dueDate) {
            const dateParam = req.query.dueDate;

            const startOfDay = new Date(Date.UTC(
                parseInt(dateParam.substring(0, 4), 10),
                parseInt(dateParam.substring(5, 7), 10) - 1,
                parseInt(dateParam.substring(8, 10), 10),
                0, 0, 0, 0
            ));

            if (!isNaN(startOfDay.getTime())) {
                const endOfDayCorrected = new Date(Date.UTC(
                    startOfDay.getUTCFullYear(),
                    startOfDay.getUTCMonth(),
                    startOfDay.getUTCDate(),
                    23, 59, 59, 999
                ));
                console.log('Raw dueDate query:', req.query.dueDate);
                console.log('Parsed startOfDay (UTC ISO):', startOfDay.toISOString());
                console.log('Parsed endOfDayCorrected (UTC ISO):', endOfDayCorrected.toISOString());

                filters.dueDate = {$gte: startOfDay, $lte: endOfDayCorrected};
                console.log('Applied dueDate filter:', filters.dueDate);
            } else {
                console.log('Invalid date received for dueDate:', req.query.dueDate);
            }
        }

        // Objeto de Ordenamiento
        let sortOptions = {createdAt: -1};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            const sortField = parts[0];
            const sortOrder = parts[1] === 'desc' ? -1 : 1;
            const allowedSortFields = ['title', 'status', 'dueDate', 'createdAt', 'updatedAt'];
            if (allowedSortFields.includes(sortField)) {
                sortOptions = {[sortField]: sortOrder};
            }
        }

        console.log('Applied Filters:', filters);

        // Consultas a la Base de Datos
        const totalTasks = await Task.countDocuments(filters);
        const tasks = await Task.find(filters)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks: totalTasks,
            countOnPage: tasks.length,
            tasks: tasks,
        });
    } catch (error) {
        next(error);
    }
};

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