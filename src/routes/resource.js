const authMiddleware = require('../middleware/auth')
const resourceController = require('../controllers/resource')

module.exports = function(app, passport) {
  app.get('/resource', (req, res) => {
    req.passport = passport
  }, authMiddleware, resourceController.getPerson)


  // app.get('/person', (req, res, next) => { passport.authenticate('jwt', personController.getPerson)(req, res, next)})
  // app.get('/person', (req, res, next) => { passport.authenticate('jwt', personController.getPerson)(req, res, next)})
  // app.post('/department', (req, res, next) => {
  //   passport.authenticate('jwt', (err, user, info) => {
  //     if (err) { return next(err) }
  //     if (!user) return res.status(403).send({ success: false, message: 'Forbidden' })
  //     const newDepartment = new Department({
  //       department_name: get(req, 'body.department_name')
  //     })
  
  //     newDepartment.save(err => {
  //       if (err) { return next(err) }
  //       res.send({ success: true })
  //     })
  //   })(req, res, next)
  // })
  // app.put('/department', async (req, res, next) => {
  //   await Department.findOneAndUpdate(
  //     { department_uuid: get(req, 'body.department_uuid') },
  //     { 
  //       department_name: get(req, 'body.department_name')
  //     },
  //   )
  //   res.send({ success: true })
  // })
}