require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')

connectDB()

const app = express()

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('¡API del Gestor de Tareas está funcionando! !YEAH!')
})

app.use('/api/users', userRoutes)

app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 5000;

// app.use((req, res, next) => {
//     const error = new Error(`Not Found - ${req.originalUrl}`)
//     res.status(404)
//     next(error)
// })
//
// app.use((err, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode
//     res.status(statusCode)
//     res.json({
//         message: err.message,
//         stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
//     })
// })

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})