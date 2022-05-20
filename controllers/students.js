const studentsRouters = require('express').Router()

const mongoose = require('mongoose')
const Student = require('../models/Student')

/**
 * Servicio para crear un nuevo estudiante en la base de datos.
 */
studentsRouters.post('/', async (request, response, next) => {
  const { body } = request
  const { name, email, age, currentPostcode, familyPostcode, gender, study, currentCourse } = body

  if (!body) {
    return response.status(404).json({
      error: 'activity is missing'
    })
  }

  const student = new Student({
    name,
    email,
    age,
    currentPostcode,
    familyPostcode,
    gender,
    study,
    currentCourse,
    activities: [] // TODO: Esta información se deberá de extraer del sistema de blockchain
  })

  try {
    const savedStudent = await student.save()
    response.status(201).json(savedStudent)
  } catch (error) {
    next(error)
    mongoose.connection.close()
  }
})

/**
 * Servicio para modificar los datos de un estudiante.
 */
studentsRouters.put('/', async (request, response, next) => {
  const { id } = request.params
  const { body } = request
  const { name, email, age, currentPostcode, familyPostcode, gender, study, currentCourse } = body

  const studentNewContent = {
    name,
    email,
    age,
    currentPostcode,
    familyPostcode,
    gender,
    study,
    currentCourse
  }

  try {
    const savedStudent = await Student.findByIdAndUpdate(id, studentNewContent)
    response.status(201).json(savedStudent)
  } catch (error) {
    next(error)
    mongoose.connection.close()
  }
})

/**
 * Servicio para eliminar un estudiante.
 */
studentsRouters.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Student.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
    mongoose.connection.close()
  }
})

/**
 * Servicio para recuperar todos los estudiantes que hay en la base
 * de datos.
 */
studentsRouters.get('/', async (request, response, next) => {
  try {
    const students = await Student.find({})
    response.json(students)
    mongoose.connection.close()
  } catch (error) {
    next(error)
    mongoose.connection.close()
  }
})

/**
 * Servicio para obtener la información de un único usuario.
 */
studentsRouters.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const students = await Student.findById(id)
    response.json(students)
    mongoose.connection.close()
  } catch (error) {
    next(error)
    mongoose.connection.close()
  }
})

module.exports = studentsRouters
