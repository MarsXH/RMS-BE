const mongoose = require('mongoose')
const moment   = require('moment')
const Schema   = mongoose.Schema

const userSchema = new Schema({
  user_id         : { type: String, required: true, index: { unique: true } },
  user_name       : { type: String },
  user_status     : { type: Number },
  user_created    : { type: Number },
  user_updated    : { type: Number },
  user_role       : { type: Number }
})

userSchema.pre('save', function(next) {
  this.user_created = this.user_created || moment().format('X')
  this.user_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('user', userSchema)
