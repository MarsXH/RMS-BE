const authMiddleware = require('../middleware/auth')
const personController = require('../controllers/person')

module.exports = function(app) {
  app.get('/person', authMiddleware, personController.getPerson)
}