
module.exports = function (req, res, next) {
  // if (req.isAuthenticated()) return next()
  req.passport && req.passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.send({ success: true, code: 0, message: '权限禁止' })
    req.userInfo = user
    next()
  })(req, res, next)
}