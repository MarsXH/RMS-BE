const authController = require('../controllers/auth')

module.exports = function (app) {
  app.post('/login', authController.login)
}