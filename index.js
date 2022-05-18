const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors) // Para evitar error CORS
app.use(express.json())

let activites = [
  {
    id: 1,
    name: 'Taller chulo',
    description: 'sakjhid kjshiudh jkshduhis',
    faculty: 'F. de Informática',
    date: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Taller chulo',
    description: 'sakjhid kjshiudh jkshduhis',
    faculty: 'F. de Derecho',
    date: new Date().toISOString()
  }
]

app.get('/', (reques, response) => {
  response.send('<h1>API Luce-Analysis</h1>')
})

/**
 * Devuelve todas las actividades.
 */
app.get('/activities', (request, response) => {
  response.json(activites)
})

/**
 * Devuelve la información de una actividad a partir de
 * su identificador de actividad.
 */
app.get('/activities/:id', (request, response) => {
  const id = Number(request.params.id)
  const activity = activites.find(activity => activity.id === id)

  if (activity) { response.json(activity) } else { response.status(404).end() }
})

/**
 * Elimina una actividad del registro a partir de
 * su identificador de actividad.
 */
app.delete('/activities/:id', (request, response) => {
  const id = Number(request.params.id)

  activites = activites.filter(activity => activity.id !== id)
  response.status(204).end()
})

/**
 * Crea una nueva actividad con la información enviada
 * por el cuerpo.
 */
app.post('/activities', (request, response) => {
  const activity = request.body

  if (!activity || !activity.name) {
    return response.status(404).json({
      error: 'activity is missing'
    })
  }

  const ids = activites.map(activity => activity.id)
  const maxId = Math.max(...ids)

  const newActivity = {
    id: maxId + 1,
    name: activity.name,
    description: activity.description,
    faculty: activity.faculty,
    date: new Date().toISOString()

  }

  activites = [...activites, newActivity]

  response.status(201).json(newActivity)
})

app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not found'
  })
})

/**
 * Levantamos el servidor. Para entrar a la API:
 * http://localhost:3001/
 */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
