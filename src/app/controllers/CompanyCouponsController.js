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
      return res.json({
        erro: err.errors
      })
    }

    if (req.employee.role !== 1) return res.json({ error: 'Only Owners can create coupons' })

    const coupon = await CompanyCoupons.create({
      company_id: req.employee.company.id,
      ...isValid
    })

    return res.json(coupon)
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
      return res.status(401).json({
        error: 'Only owners can update coupons'
      })
    }

    const { id, name, description, points } = await CompanyCoupons.update(req.body)

    return res.json({
      id,
      name,
      description,
      points
    })
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
      return res.status(400).json({ error: 'No coupons registered' })
    }

    return res.json(coupons)
  }
}

module.exports = new CompanyCouponsController()
