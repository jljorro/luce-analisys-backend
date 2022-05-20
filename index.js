require('dotenv').config()
require('./mongo') // Para conectarse a MongoDb

const express = require('express')
const app = express()
const cors = require('cors')

const activitiesRouter = require('./controllers/activities')
const studentsRouter = require('./controllers/students')

app.use(cors()) // Para evitar error CORS
app.use(express.json())

app.get('/', (reques, response) => {
  response.send('<h1>API Luce-Analysis</h1>')
})

/**
 * Entradas de la API:
 * - /activities: gestión de las actividades incluidas en LUCE
 * - /students: getsión de los estudiantes incluidos en LUCE
 */
app.use('/activities', activitiesRouter)
app.use('/students', studentsRouter)

/**
 * Middleware para mostrar un error 404 cuando buscamos
 * un recurso que no existe.
 */
app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not found'
  })
})

/**
 * Middleware para mostrar todos los errores de la API.
 */
app.use((error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'id is malformed.' })
  } else {
    response.status(500).end()
  }
})

/**
 * Levantamos el servidor. Para entrar a la API:
 * http://localhost:3001/
 */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
