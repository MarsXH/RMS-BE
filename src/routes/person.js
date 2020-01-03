const authMiddleware = require('../middleware/auth')
const personController = require('../controllers/person')

module.exports = function(app) {
  app.get('/getPerson', authMiddleware, personController.getPerson)
  app.post('/addPerson', authMiddleware, personController.addPerson)
  app.put('/updatePerson', authMiddleware, personController.updatePerson)
  app.delete('/deletePerson', authMiddleware, personController.deletePerson)
}
