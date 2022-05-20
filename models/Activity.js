const { default: mongoose } = require('mongoose')
const { Schema, model } = mongoose

const activitySchema = new Schema({
  name: String,
  description: String,
  faculty: String,
  date: Date,
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
})

activitySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Activity = model('Activity', activitySchema)

module.exports = Activity
