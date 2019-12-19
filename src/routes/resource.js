const authMiddleware = require('../middleware/auth')
const resourceController = require('../controllers/resource')

module.exports = function(app) {
  app.get('/resource', authMiddleware, resourceController.getResource)
}