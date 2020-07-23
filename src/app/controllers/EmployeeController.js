const Yup = require('yup')
const Employee = require('../models/Employee')
const CompanyEmployee = require('../models/CompanyEmployee')
const validarCpf = require('validar-cpf')
const {
  Op
} = require('sequelize')

class EmployeeController {
  async store (req, res) {
    const schemaCreateEmployee = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string().length(11).required(),
      password: Yup.string().min(3).required(),
      role: Yup.number().required()
    })

    let isValid = null
    try {
      isValid = await schemaCreateEmployee.validate(req.body, { abortEarly: false })
    } catch (err) {
      res.locals.payload = {
        status: 400,
        code: 'validationError',
        body: err.errors
      }
      return next();
    }

    const {
      cpf,
      name,
      role,
      password
    } = isValid

    const validcpf = validarCpf(cpf)

    if (!validcpf) {
      res.locals.payload = {
        status: 400,
        code: 'cpfInvalid'
      }
      return next();
    } 

    if (req.employee.role !== 1) {
      res.locas.payload = {
        status: 400,
        code: 'noPermission'
      }
      return next();
    } 

    Employee.findOrCreate({
      where: {
        cpf
      },
      defaults: {
        name,
        password_temp: password,
        role
      }
    }).spread(async (user, created) => {
      const temp = await CompanyEmployee.findOne({
        where: {
          company_id: req.params.company_id,
          employee_id: user.id
        }
      })
      if (!temp) {
        await CompanyEmployee.create({
          company_id: req.params.company_id,
          employee_id: user.id
        })
      }
      res.locals.payload = {
        status: 200,
        code: 'employeeCreated',
        body: user
      }
      return next();
    })
  }

  async update (req, res) {
    if (req.employee.role !== 1) {
      res.locals.payload = {
        status: 400,
        code: 'noPermission',
      }
      return next();
    }

    const schema = Yup.object().shape({
      employee_id: Yup.string().required(),
      name: Yup.string(),
      role: Yup.string(),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().min(6)
    })

    let isValid = null

    try {
      isValid = await schema.validate({
        ...req.body,
        employee_id: req.params.employee_id
      }, { abortEarly: false })
    } catch (err) {
      res.locals.payload = {
        status: 400,
        code: 'validationError',
        body: err.errors
      }
      return next();
    }

    const {
      name,
      role,
      employee_id,
      password,
      confirmPassword
    } = isValid

    const employee = await Employee.findOne({
      where: {
        id: employee_id
      }
    })

    if (name) employee.name = name
    if (role) employee.role = role

    if (password && confirmPassword && (password === confirmPassword)) {
      employee.password_temp = password
    }

    await employee.save()

    res.locals.payload = {
      status: 200,
      code: 'employeeFound',
      body: employee.toJSON()
    }
    return next();
  }

  async index (req, res) {
    if (req.employee.role !== 1) {
      res.locals.payload = {
        status: 400,
        code: 'validationError'
      }
      return next();
    } 
    const employees = await CompanyEmployee.findAll({
      where: {
        company_id: req.employee.company.id
      },
      include: [
        {
          model: Employee,
          as: 'employee'
        }
      ]
    })

    if (employees < 1) {
      res.locals.payload = {
        status: 400,
        code: 'noEmployeeRegistered'
      }
      return next();
    }
    res.locals.payload = {
      status: 400,
      code: 'employeeFound',
      body: employees
    }
    return next();
  }

  async delete (req, res) {
    if (req.employee.role !== 1) {
      res.locals.payload = {
        status: 400,
        code: 'validationError'
      }
      return next();
    }

    const employee = await Employee.findOne({
      where: {
        id: req.params.employee_id,
        role: { [Op.not]: 1 }
      }
    })

    if (!employee) {
      res.locals.payload = {
        status: 400,
        code: 'validationError'
      }
      return next();
    } else {
      await employee.destroy()
    }

    res.locals.payload = {
      status: 200,
      code: 'employeeDeleted'
    }
    return next();
  }
}

module.exports = new EmployeeController()
