const mongoose = require('mongoose')
const moment = require('moment')
const uuid     = require('uuid')
const Schema = mongoose.Schema

const personSchema = new Schema({
  person_id : { type: Number, required: true },
  person_uuid : { type: String, required: true },
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

personSchema.pre('validate', async function (next) {
  this.person_uuid = this.person_uuid  || uuid.v4()
  this.person_created = this.person_created || moment().format('X')
  this.person_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('person', personSchema)
