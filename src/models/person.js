const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const personSchema = new Schema({
  person_id : { type: String, required: true, index: { unique: true } },
  person_name : { type: String },
  company_name : { type: String },
  department_name : { type: String },
  position_name : { type: String },
  person_age : { type: Number },
  person_phone : { type: String },
  person_address : { type: String },
  person_speciality : { type: String },
  person_created : { type: Number },
  person_updated : { type: Number }
})

personSchema.pre('save', function (next) {
  this.person_created = this.person_created || moment().format('X')
  this.person_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('person', personSchema)
