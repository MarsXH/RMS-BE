const authMiddleware = require('../middleware/auth')
const resourceController = require('../controllers/resource')

module.exports = function(app) {
  app.get('/getResource', authMiddleware, resourceController.getResource)
  app.post('/addResource', authMiddleware, resourceController.addResource)
  app.put('/updateResource', authMiddleware, resourceController.updateResource)
  app.delete('/deleteResource', authMiddleware, resourceController.deleteResource)
}
