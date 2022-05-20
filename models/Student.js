const { default: mongoose } = require('mongoose')
const { Schema, model } = mongoose

const studentSchema = new Schema({
  name: String,
  email: String,
  age: Number,
  currentPostcode: String,
  familyPostcode: String,
  gender: String,
  study: String,
  currentCourse: Number,
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }]
})

studentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Student = model('Student', studentSchema)

module.exports = Student
