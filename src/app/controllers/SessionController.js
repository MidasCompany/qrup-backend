const jwt = require('jsonwebtoken')
const Yup = require('yup')
const User = require('../models/User')
const UserPoints = require('../models/UserPoints')
const Employee = require('../models/Employee')
const authConfig = require('../../config/auth')
const Company = require('../models/Company')
const CompanyEmployee = require('../models/CompanyEmployee')

class SessionController {
  async store (req, res) {
    const schemaSession = Yup.object().shape({
      type: Yup.string().required(),
      password: Yup.string().required().min(4),
      email: Yup.string().when('type', {
        is: type => type === 'user',
        then: Yup.string().email().required(),
        otherwise: Yup.string().transform(x => undefined)
      }),
      cpf: Yup.string().when('type', {
        is: type => type === 'employee',
        then: Yup.string().length(11).required(),
        otherwise: Yup.string().transform(x => undefined)
      }),
      company_id: Yup.string().when('type', {
        is: type => type === 'employee',
        then: Yup.string(),
        otherwise: Yup.string().transform(x => undefined)
      })
    })

    let isValid = null

    try {
      isValid = await schemaSession.validate(req.body, { abortEarly: false })
    } catch (err) {
      res.locals.payload = {
        status: 400,
        code: 'validationError',
        body: err.errors
      }
      return next()
    }

    const { email, password, cpf, company_id, type } = isValid

    let data = null

    if (type === 'user') {
      data = await User.findOne({
        where: {
          email
        },
        include: [
          {
            model: UserPoints,
            as: 'points'
          }
        ]
      })

      if (!data) {
        res.locals.payload = {
          status: 400,
          code: 'userNotFound'
        }
        return next()
      } 
      if (!(await data.checkPassword(password))) {
        res.locals.payload = {
          status: 400,
          code: 'passwordDoesNotMatch'
        }
        return next()
      }
    } else if (type === 'employee') {
      data = await Employee.findOne({
        where: {
          cpf
        },
        include: [
          {
            model: CompanyEmployee,
            as: 'company',
            include: [
              {
                model: Company,
                as: 'company'
              }
            ]
          }
        ]
      })

      if (!data) {
        res.locals.payload = {
          status: 400,
          code: 'employeeNotFound'
        }
        return next()
      }

      if (!(await data.checkPassword(password))) {
        res.locals.payload = {
          status: 400,
          code: 'passwordDoesNotMatch'
        }
        return next()
      }
    }

    res.locals.payload = {
      status: 200,
      code: 'sessionCreated',
      body: {
        [type]: data,
        token: jwt.sign({ id: data.id, type, company_id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      }
    }
    return next()
  }
}

module.exports = new SessionController()
