// const User = require('../models/user')
// const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken'); //token 认证
const config = require('../config');

const login = async function (req, res, next) {
  const payload = {
    user_id: 1,
    user_name: 'zzz',
    user_role: 1
  };
  //生成token
  const token = jwt.sign(payload, config.secret, {
    expiresIn: 3600
  });
  res.send({ success: true, token, user: payload })

  // const {
  //   email,
  //   password
  // } = ctx.request.body;
  // const findResult = await User.find({
  //   email
  // });
  // const user = findResult[0];
  // if (findResult.length === 0) {
  //   //表示不存在该用户
  //   ctx.status = 404;
  //   ctx.body = {
  //     message: '该用户不存在'
  //   };
  //   return;
  // }
  // //验证密码是否正确
  // const verify = bcrypt.compareSync(password, user.password);
  // if (verify) {
  //   //密码正确
  //   const payload = {
  //     name: user.name,
  //     email,
  //     avatar: user.avatar
  //   };
  //   //生成token
  //   const token = jwt.sign(payload, config.secretKey, {
  //     expiresIn: 3600
  //   });

  //   ctx.status = 200;
  //   ctx.body = {
  //     message: '验证成功',
  //     token: 'Bearer ' + token
  //   }
  // } else {
  //   ctx.status = 500;
  //   ctx.body = {
  //     message: '密码错误'
  //   };
  // }
};

module.exports = {
  login
};
