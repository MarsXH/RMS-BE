const mongoose = require('mongoose')
const moment = require('moment')
const uuid     = require('uuid')
const Schema = mongoose.Schema

const resourceSchema = new Schema({
  resource_id : { type: Number, required: true },
  resource_uuid : { type: String, required: true },
  resource_name : { type: String },
  company_name : { type: String },
  resource_supplier : { type: String },
  resource_model : { type: String },
  resource_stock : { type: Number },
  resource_ullage : { type: Number },
  resource_addressee : { type: String },
  resource_addresser : { type: String },
  resource_created : { type: Number },
  resource_updated : { type: Number }
})

resourceSchema.pre('validate', async function (next) {
  this.resource_uuid = this.resource_uuid  || uuid.v4()
  this.resource_created = this.resource_created || moment().format('X')
  this.resource_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('resource', resourceSchema)
