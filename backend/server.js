require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')

connectDB()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('¡API del Gestor de Tareas está funcionando! !YEAH!')
})

app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})