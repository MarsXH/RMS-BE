const authMiddleware = require('../middleware/auth')
const peopleController = require('../controllers/people')

module.exports = function(app) {
  app.get('/getPeople', authMiddleware, peopleController.getPeople)
  app.post('/addPeople', authMiddleware, peopleController.addPeople)
  app.put('/updatePeople', authMiddleware, peopleController.updatePeople)
  app.delete('/deletePeople', authMiddleware, peopleController.deletePeople)
}
