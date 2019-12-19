const User = require('../models/user')
// const bcrypt = require('bcryptjs');
const { get } = require('lodash')

const jwt = require('jsonwebtoken'); //token 认证
const config = require('../config');
const JWT_SIGNING_COOKIE_NAME = 'authorization'

const validateToken = async function (req, res, next) {
  const token = jwt.sign(userInfo, config.secret, {
    expiresIn: config.JWT_EXPIRY
  });
  res.cookie(JWT_SIGNING_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + ms(JWT_EXPIRY)),
  })
};

const login = async function (req, res, next) {
  const username = get(req, 'body.username')
  const password = get(req, 'body.password')
  const userInfo = await User.findOne({ user_name: username })
  if (userInfo) {
    const verify = bcrypt.compareSync(password, userInfo.user_password);
    if (verify) {
      //生成token
      const token = jwt.sign(userInfo, config.secret, {
        expiresIn: config.JWT_EXPIRY
      });
      res.send({ success: true, token, user: userInfo })
    } else {
      res.status(403).send({ success: false, message: '密码错误！' })
    }
  } else {
    res.status(403).send({ success: false, message: '该用户不存在！' })
  }
};

const register = async function (req, res, next) {
  const username = get(req, 'body.username')
  const password = get(req, 'body.password')
  const userInfo = await User.findOne({ user_name: username })
  if (userInfo) {
    res.status(403).send({ success: false, message: '该用户已存在！' })
  } else {
    
    res.send({ success: true, token, user: userInfo })
  }
};

const logout = async function (req, res, next) {
  const bearerHearder = req.cookies.authorization
  if (bearerHearder) {
    res.clearCookie(JWT_SIGNING_COOKIE_NAME)
    res.send('logout success')
  } else {
    res.status(403).send({ success: false, message: '退出失败！' })
  }
};

module.exports = {
  validateToken,
  login,
  register,
  logout
};
