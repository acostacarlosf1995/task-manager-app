const Project = require('../models/Project');
const Task = require('../models/Task');

// @route POST /api/projects
const createProject = async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const project = await Project.create({
            user: req.user._id, // Asociado al usuario logueado
            name,
            description,
        });
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

// @route GET /api/projects
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({user: req.user._id}).sort({createdAt: -1});
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

// @route GET /api/projects/:id
const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/projects/:id
const updateProject = async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Unauthorized user');
        }

        project.name = name || project.name;
        project.description = description !== undefined ? description : project.description;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Unauthorized user');
        }

        await Task.deleteMany({project: project._id, user: req.user._id});

        await Project.findByIdAndDelete(req.params.id);

        res.json({message: 'Project and task related deleted', id: req.params.id});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};