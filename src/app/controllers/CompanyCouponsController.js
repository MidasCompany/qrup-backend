const Yup = require('yup')
const CompanyCoupons = require('../models/CompanyCoupons')
const Company = require('../models/Company')
const Employee = require('../models/Employee')

class CompanyCouponsController {
  async store (req, res) {
    const schemaCreateCoupon = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      points: Yup.number().positive().required(),
      code: Yup.string().min(3).required()
    })

    let isValid = null
    try {
      isValid = await schemaCreateCoupon.validate(req.body, { abortEarly: false })
    } catch (err) {

      res.locals.payload = {
        status: 400,
        code: 'validationError',
        body: err.errors
      }
      return next();
    }

    if (req.employee.role !== 1) return res.json({ error: 'Only Owners can create coupons' })

    const coupon = await CompanyCoupons.create({
      company_id: req.employee.company.id,
      ...isValid
    })

    res.locals.payload = {
      status: 200,
      code: 'couponCreated',
      body: coupon
    }
    return next();
  }

  async update (req, res) {
    const checkUserNotEmployeeAndManager = await Employee.findOne({
      where: {
        id: req.employee_id,
        employee: false,
        manager: false
      }
    })

    if (!checkUserNotEmployeeAndManager) {

      res.locals.payload = {
        status: 403,
        code: 'notOwner'
      }
      return next();
    }

    const { id, name, description, points } = await CompanyCoupons.update(req.body)

    res.locals.payload = {
      status: 200,
      code: 'couponUpdated',
      body: {
        id,
        name,
        description,
        points
      }
    }
    return next();
  }

  async index (req, res) {
    const coupons = await CompanyCoupons.findAll({
      where: { company_id: req.params.company_id },
      attributes: ['id', 'name', 'description', 'points'],
      include: [{
        model: Company,
        attributes: ['name', 'address', 'contact', 'cnpj']
      }]
    })

    if (coupons < 1) {
      res.locals.payload = {
        status: 400,
        code: 'noCouponsRegistered'
      }
      return next();
    }
    res.locals.payload = {
      status: 200,
      code: 'couponsFound',
      body: coupons
    }
    return next();
  }
}

module.exports = new CompanyCouponsController()
