const User = require('../models/user')
const md5 = require('md5')
// const bcrypt = require('bcrypt')
const { get } = require('lodash')
const uuid = require('uuid')
const jwt = require('jsonwebtoken') //token 认证
const config = require('../config')
// const salt = bcrypt.genSaltSync(config.saltRounds)

const GenerateToken = user => {
  return jwt.sign({
    user_id: get(user, 'user_id'),
    user_uuid: get(user, 'user_uuid'),
    user_name: get(user, 'user_name'),
    user_role: get(user, 'user_role')
  }, config.JWT_SECRET, {
    jwtid: uuid.v4(),
    expiresIn: config.JWT_EXPIRY,
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
    algorithm: config.JWT_ALG
  })
}

const ReturnUserInfo = user => {
  return {
    user_id: get(user, 'user_id'),
    user_uuid: get(user, 'user_uuid'),
    user_name: get(user, 'user_name'),
    user_created: get(user, 'user_created'),
    user_updated: get(user, 'user_updated'),
    user_role: get(user, 'user_role')
  }
}

const login = async function (req, res, next) {
  try {
    const username = get(req, 'body.user_name')
    const password = get(req, 'body.user_password')
    const userInfo = await User.findOne({ user_name: username })
    if (userInfo) {
      const verify = md5(password) === get(userInfo, 'user_password')
      if (verify) {
        // 生成token
        const token = GenerateToken(userInfo)
        res.cookie('authorization', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          expires: new Date(Date.now() + config.JWT_EXPIRY)
        })
        // 存储token到redis
        return res.send({ success: true, code: 1, token: 'Bearer ' + token, user: ReturnUserInfo(userInfo) })
      } else {
        return res.send({ success: true, code: 0, message: '密码错误！' })
      }
    } else {
      return res.send({ success: true, code: 0, message: '该用户不存在！' })
    }
  } catch (error) {
    return res.send({ success: true, code: 0, message: '登录失败！error:' + error })
  }
}

const validateToken = async function (req, res, next) {
  const token = GenerateToken(req.userInfo)
  res.cookie('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + config.JWT_EXPIRY)
  })
  return res.send({ success: true, code: 1, user: ReturnUserInfo(req.userInfo) })
}

const getUser =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 2) {
    try {
      const { page = 1, size = 10, string = '' } = get(req, 'query')
      const limit = parseInt(size)
      const allUser = await User.find({ 'user_name': { '$regex': string } }).skip((page - 1) * size).limit(limit).sort({'_id': 1})
      const total = await User.find({ 'user_name': { '$regex': string } }).countDocuments()
      return res.send({ success: true, code: 1, user_list: allUser || [], total })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '获取用户列表失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
}

const register = async function (req, res, next) {
  if (get(req, 'userInfo.user_role') === 3) {
    try {
      const username = get(req, 'body.user_name')
      const password = get(req, 'body.user_password') || '123456'
      const userRole = get(req, 'body.user_role')
      const checkUsername = await User.findOne({ user_name: username })
      if (checkUsername) {
        return res.send({ success: true, code: 0, message: '该用户已存在！' })
      } else {
        let userid = 0
        const rows = await User.find({}).sort({'user_id': -1}).limit(1)
        if (rows && rows.length) {
          userid = rows[0].user_id + 1
        } else {
          userid = 0
        }
        const newUserInfo = new User({
          user_id: userid,
          user_name: username,
          user_password: md5(password),
          user_role: userRole
        })
        newUserInfo.save().then(result => {
          return res.send({ success: true, code: 1, user: ReturnUserInfo(result) })
        }).catch(error => {
          console.log("Error:" + error)
          return res.send({ success: true, code: 0, message: '注册失败！error:' + error })
        })
      }
    } catch (error) {
      return res.send({ success: true, code: 0, message: '注册失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止注册！' })
  }
}

const changeUserInfo = async function (req, res, next) {
  const useruuid = get(req, 'body.user_uuid')
  const tokenUserRole = get(req, 'userInfo.user_role')
  if (tokenUserRole === 3 || useruuid === get(req, 'userInfo.user_uuid')) {
    try {
      const isResetPsw = get(req, 'body.is_reset_password')
      const isChangePsw = get(req, 'body.is_change_password')
      const isChangeUsername = get(req, 'body.is_change_username')
      const username = get(req, 'body.user_name')
      const userRole = useruuid === get(req, 'userInfo.user_uuid') ? tokenUserRole : get(req, 'body.user_role')
      const userInfo = await User.findOne({ user_uuid: useruuid })
      if (userInfo) {
        const params = {
          user_name: username,
          user_role: userRole
        }
        if (isChangeUsername) { // 重置用户名
          const checkNewUsername = await User.findOne({ user_name: username })
          if (checkNewUsername) return res.send({ success: true, code: 0, message: '用户名已存在' })
          params.user_name = username
        }

        if (isResetPsw) { // 重置密码
          params.user_password = md5('123456')
        }

        if (isChangePsw) { // 通过原密码修改密码
          const password = get(req, 'body.user_password')
          const verify = md5(password) === get(userInfo, 'user_password')
          if (!verify) return res.send({ success: true, code: 0, message: '原密码错误！' })
          const newPassword = get(req, 'body.new_user_password')
          params.user_password = md5(newPassword)
        }
        
        await User.updateOne({ user_uuid: useruuid }, params)
        const newUserInfo = await User.findOne({ user_uuid: useruuid })
        return res.send({ success: true, code: 1, user: ReturnUserInfo(newUserInfo) })
      } else {
        return res.send({ success: true, code: 0, message: '该用户不存在！' })
      }
    } catch (error) {
      return res.send({ success: true, code: 0, message: '修改失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止修改！' })
  }
}

const deleteUser = async function (req, res, next) {
  if (get(req, 'userInfo.user_role') === 3) {
    try {
      const useruuid = get(req, 'query.user_uuid')
      const checkUser = await User.findOne({ user_uuid: useruuid })
      if (checkUser) {
        const newUserInfo = await User.deleteOne({
          user_uuid: useruuid
        })
        return res.send({ success: true, code: 1, user: ReturnUserInfo(newUserInfo) })
      } else {
        return res.send({ success: true, code: 0, message: '该用户不存在！' })
      }
    } catch (error) {
      return res.send({ success: true, code: 0, message: '删除失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止删除！' })
  }
}

const logout = async function (req, res, next) {
  // 清除redis中的token
  res.clearCookie('authorization')
  return res.send({ success: true, code: 1, message: '退出成功！' })
}

module.exports = {
  login,
  validateToken,
  getUser,
  register,
  changeUserInfo,
  deleteUser,
  logout
}
