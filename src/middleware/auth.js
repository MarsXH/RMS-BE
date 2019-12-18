
module.exports = function (req, res, next) {
  // if (req.isAuthenticated()) return next()
  req.passport && req.passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) return res.status(403).send({ success: false, message: 'Forbidden' })
    next()
  })(req, res, next)
}