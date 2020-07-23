const Cup = require('../models/Cup')

class AdminController {
  async allCups (req, res) {
    res.locals.payload = {
      status: 200,
      code: 'allCups',
      body: await Cup.findAll()
    }
    return next()
  }
}

module.exports = new AdminController()
