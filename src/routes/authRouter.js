const authController = require('../controllers/auth')

module.exports = function (app) {
  app.post('/login', authController.login)
  app.post('/validateToken', authController.validateToken)
  app.post('/register', authController.register)
  app.post('/logout', authController.logout)
}