require('dotenv').config()
require('./mongo') // Para conectarse a MongoDb

const express = require('express')
const app = express()
const cors = require('cors')

const Activity = require('./models/Activity')
const { default: mongoose } = require('mongoose')

app.use(cors()) // Para evitar error CORS
app.use(express.json())

app.get('/', (reques, response) => {
  response.send('<h1>API Luce-Analysis</h1>')
})

/**
 * Devuelve todas las actividades.
 */
app.get('/activities', (request, response) => {
  Activity.find({})
    .then(activities => {
      response.json(activities)
      mongoose.connection.close()
    }).catch(err => {
      console.log(err)
      mongoose.connection.close()
    })
})

/**
 * Devuelve la información de una actividad a partir de
 * su identificador de actividad.
 */
app.get('/activities/:id', (request, response, next) => {
  const { id } = request.params

  Activity.findById(id).then(activity => {
    if (activity) {
      return response.json(activity)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

/**
 * Elimina una actividad del registro a partir de
 * su identificador de actividad.
 */
app.delete('/activities/:id', (request, response, next) => {
  const { id } = request.params

  Activity.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    }).catch(error => next(error))
})

/**
 * Crea una nueva actividad con la información enviada
 * por el cuerpo.
 */
app.post('/activities', (request, response) => {
  const activity = request.body

  if (!activity.name) {
    return response.status(404).json({
      error: 'activity is missing'
    })
  }

  const newActivity = new Activity({
    name: activity.name,
    description: activity.description,
    faculty: activity.faculty,
    date: new Date()
  })

  newActivity.save().then(savedActivity => {
    response.status(201).json(savedActivity)
  })
})

/**
 * Servicio que nos permite modificar los campos
 * de una actividad a partir de su id.
 */
app.put('/activities', (request, response, next) => {
  const { id } = request.params
  const activity = request.body

  const activityNewContent = {
    name: activity.name,
    description: activity.description,
    faculty: activity.faculty
  }

  Activity.findByIdAndUpdate(id, activityNewContent)
    .then(savedActivity => {
      response.status(201).json(savedActivity)
    }).catch(error => next(error))
})

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
