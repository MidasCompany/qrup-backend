const Cup = require('../models/Cup')

class CupController {
  async store (req, res, next) {
    const {
      description,
      qr
    } = req.body

    const user = req.user

    const CupEx = await Cup.findOne({
      where: { qr }
    })

    if (!CupEx) {
      res.locals.payload = {
        status: 400,
        code: 'cupNotRegistered',
      }
      return next();
    } 

    CupEx.user_id = user.id
    CupEx.description = description
    CupEx.enabled = true

    await CupEx.save()

    res.locals.payload = {
      status: 200,
      code: 'cupFound',
      body: CupEx
    }
    return next();
  }

  async index (req, res, next) {
    const cups = await Cup.findAll({
      where: {
        user_id: req.user.id
      },
      order: ['updated_at']
    })

    if (!cups) {
      res.locals.payload = {
        status: 400,
        code: 'noCupsRegistered'
      }
      return next();
    }
    res.locals.payload = {
      status: 200,
      code: 'allCupsFound',
      body: cups
    }
    return next();
  }

  async delete (req, res, next) {
    const cup = await Cup.findOne({
      where: {
        qr: req.params.qr,
        user_id: req.user.id,
        enabled: true
      }
    })
    if (!cup) {
      res.locals.payload = {
        status: 400,
        code: 'cupNotRegistered'
      }
      return next();
    }

    await cup.destroy()

    res.locals.payload = {
      status: 200,
      code: 'cupDeleted'
    }
    return next();
  }
}

module.exports = new CupController()
