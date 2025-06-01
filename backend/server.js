require('dotenv').config()

const express = require('express')
const cors = require('cors');
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const projectRoutes = require('./routes/projectRoutes')

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const app = express()

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send('¡API del Gestor de Tareas está funcionando! !YEAH!')
})

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes);

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
})

app.use((err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        console.log('CastError (ObjectId no valid):', err);
        statusCode = 400;
        message = 'Invalid ID';
    }

    if (err.name === 'ValidationError') {
        console.log('ValidationError from mongoose:', err);
        statusCode = 400;
        message = err.message;
    }

    console.error('Error:', err.message, '\nSTACK Code:', err.stack);

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    })
})

const PORT = process.env.PORT || 5000;

let serverInstance;

if (require.main === module) {
    serverInstance = app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT} in mode ${
            process.env.NODE_ENV || 'development'
        }`);
    })
}

module.exports = app;