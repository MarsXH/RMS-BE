const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const resourceSchema = new Schema({
  resource_id : { type: String, required: true, index: { unique: true } },
  resource_name : { type: String },
  company_name : { type: String },
  resource_supplier : { type: String },
  resource_model : { type: String },
  resource_stock : { type: Number },
  resource_ullage : { type: Number },
  resource_addressee : { type: String },
  resource_addressee : { type: String },
  resource_created : { type: Number },
  resource_updated : { type: Number }
})

resourceSchema.pre('save', function (next) {
  this.resource_created = this.resource_created || moment().format('X')
  this.resource_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('resource', resourceSchema)
