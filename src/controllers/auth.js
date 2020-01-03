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
        // 存储token到redis
        res.send({ success: true, token, user: ReturnUserInfo(userInfo) })
      } else {
        res.status(403).send({ success: false, message: '密码错误！' })
      }
    } else {
      res.status(403).send({ success: false, message: '该用户不存在！' })
    }
  } catch (error) {
    res.status(403).send({ success: false, message: '登录失败！error:' + error })
  }
}

const validateToken = async function (req, res, next) {
  res.send({ success: true, user: ReturnUserInfo(req.userInfo) })
}

const register = async function (req, res, next) {
  if (get(req, 'userInfo.user_role') === 3) {
    try {
      const username = get(req, 'body.user_name')
      const password = get(req, 'body.user_password')
      const userRole = get(req, 'body.user_role')
      const checkUsername = await User.findOne({ user_name: username })
      if (checkUsername) {
        res.status(403).send({ success: false, message: '该用户已存在！' })
      } else {
        let userid = 0
        const rows = await User.find({}).sort({'user_id':-1}).limit(1)
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
          res.send({ success: true, user: ReturnUserInfo(result) })
        }).catch(error => {
          console.log("Error:" + error)
          res.status(403).send({ success: false, message: '注册失败！error:' + error })
        })
      }
    } catch (error) {
      res.status(403).send({ success: false, message: '注册失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止注册！' })
  }
}

const changeUserInfo = async function (req, res, next) {
  try {
    const isResetPsw = get(req, 'body.is_reset_password')
    const useruuid = get(req, 'body.user_uuid')
    const username = get(req, 'body.user_name')
    const password = get(req, 'body.user_password')
    const newPassword = isResetPsw ? '123456' : get(req, 'body.new_user_password')
    const userInfo = await User.findOne({ user_uuid: useruuid })
    if (userInfo) {
      if (!isResetPsw) {
        const verify = md5(password) === get(userInfo, 'user_password')
        if (!verify) res.status(403).send({ success: false, message: '原密码错误！' })
      }
      const userRole = get(req, 'body.user_role') || get(userInfo, 'user_role')
      await User.update({ user_uuid: useruuid }, {
        user_name: username || get(userInfo, 'user_name'),
        user_password: md5(newPassword),
        user_role: userRole
      })
      const newUserInfo = await User.findOne({ user_uuid: useruuid })
      res.send({ success: true, user: ReturnUserInfo(newUserInfo) })
    } else {
      res.status(403).send({ success: false, message: '该用户不存在！' })
    }
  } catch (error) {
    res.status(403).send({ success: false, message: '修改失败！error:' + error })
  }
}

const deleteUser = async function (req, res, next) {
  if (get(req, 'userInfo.user_role') === 3) {
    try {
      const useruuid = get(req, 'body.user_uuid')
      const checkUser = await User.findOne({ user_uuid: useruuid })
      if (checkUser) {
        const newUserInfo = await User.remove({
          user_uuid: useruuid
        })
        res.send({ success: true, user: ReturnUserInfo(newUserInfo) })
      } else {
        res.status(403).send({ success: false, message: '该用户不存在！' })
      }
    } catch (error) {
      res.status(403).send({ success: false, message: '删除失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止删除！' })
  }
}

const logout = async function (req, res, next) {
  // 清除redis中的token
  res.clearCookie('authorization')
  res.send({ success: true, message: '退出成功！' })
}

module.exports = {
  login,
  validateToken,
  register,
  changeUserInfo,
  deleteUser,
  logout
}
