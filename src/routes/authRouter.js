const authMiddleware = require('../middleware/auth')
const authController = require('../controllers/auth')

module.exports = function (app) {
  app.post('/login', authController.login)
  app.post('/validateToken', authMiddleware, authController.validateToken)
  app.post('/register', authMiddleware, authController.register)
  app.post('/changeUserInfo', authMiddleware, authController.changeUserInfo)
  app.post('/deleteUser', authMiddleware, authController.deleteUser)
  app.post('/logout', authMiddleware, authController.logout)
}