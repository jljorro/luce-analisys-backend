const activitiesRouters = require('express').Router()

const mongoose = require('mongoose')
const Activity = require('../models/Activity')

/**
 * Devuelve todas las actividades.
 */
activitiesRouters.get('/', async (request, response, next) => {
  try {
    const activities = await Activity.find({})
    response.json(activities)
  } catch (error) {
    next(error)
  } finally {
    mongoose.connection.close()
  }
})

/**
   * Devuelve la información de una actividad a partir de
   * su identificador de actividad.
   */
activitiesRouters.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const activity = Activity.findById(id)
    response.json(activity)
  } catch (error) {
    next(error)
  } finally {
    mongoose.connection.close()
  }
})

/**
   * Elimina una actividad del registro a partir de
   * su identificador de actividad.
   */
activitiesRouters.delete('/:id', (request, response, next) => {
  const { id } = request.params

  try {
    Activity.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  } finally {
    mongoose.connection.close()
  }
})

/**
   * Crea una nueva actividad con la información enviada
   * por el cuerpo.
   */
activitiesRouters.post('/', async (request, response, next) => {
  const { body } = request
  const { name, description, faculty } = body

  if (!body) {
    return response.status(404).json({
      error: 'activity is missing'
    })
  }

  const newActivity = new Activity({
    name,
    description,
    faculty,
    date: new Date(),
    students: []
  })

  try {
    const savedActivity = await newActivity.save()
    response.status(201).json(savedActivity)
  } catch (error) {
    next(error)
  } finally {
    mongoose.connection.close()
  }
})

/**
   * Servicio que nos permite modificar los campos
   * de una actividad a partir de su id.
   */
activitiesRouters.put('/', async (request, response, next) => {
  const { id } = request.params
  const activity = request.body

  const activityNewContent = {
    name: activity.name,
    description: activity.description,
    faculty: activity.faculty
  }

  try {
    const savedActivity = await Activity.findByIdAndUpdate(id, activityNewContent)
    response.status(201).json(savedActivity)
  } catch (error) {
    next(error)
  } finally {
    mongoose.connection.close()
  }
})

module.exports = activitiesRouters
