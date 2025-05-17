const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // A qué usuario pertenece este proyecto
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Para asegurar que un mismo usuario no tenga dos proyectos con el mismo nombre (opcional)
// projectSchema.index({ user: 1, name: 1 }, { unique: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;