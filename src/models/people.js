const mongoose = require('mongoose')
const moment = require('moment')
const uuid     = require('uuid')
const Schema = mongoose.Schema

const peopleSchema = new Schema({
  people_id : { type: Number, required: true },
  people_uuid : { type: String, required: true },
  people_name : { type: String },
  company_name : { type: String },
  department_name : { type: String },
  position_name : { type: String },
  people_age : { type: Number },
  people_phone : { type: String },
  people_address : { type: String },
  people_speciality : { type: String },
  people_created : { type: Number },
  people_updated : { type: Number }
})

peopleSchema.pre('validate', async function (next) {
  this.people_uuid = this.people_uuid  || uuid.v4()
  this.people_created = this.people_created || moment().format('X')
  this.people_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('people', peopleSchema)
