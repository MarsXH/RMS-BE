const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const userSchema = new Schema({
  user_id : { type: String, required: true, index: { unique: true } },
  user_name : { type: String },
  user_password : { type: String },
  user_created : { type: Number },
  user_updated : { type: Number },
  user_role : { type: Number } // 0: 账户锁定(无权限) 1: 普通用户 2: admin 3: superadmin
})

userSchema.pre('save', function (next) {
  this.user_created = this.user_created || moment().format('X')
  this.user_updated = moment().format('X')
  next()
})

module.exports = mongoose.model('user', userSchema)
