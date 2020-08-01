const Yup = require('yup')
const Company = require('../models/Company')
const Employee = require('../models/Employee')
const CompanyEmployee = require('../models/CompanyEmployee')
const { validate } = require('cnpj')
const validarCpf = require('validar-cpf')
class CompanyController {
  async store (req, res, next) {
    const schemaCreateCompany = Yup.object().shape({
      nameCompany: Yup.string().required(),
      address: Yup.string().required(),
      cnpj: Yup.string().min(14).required(),
      contact: Yup.string().default('0000000'),

      nameOwner: Yup.string().default(''),
      cpf: Yup.string().min(11).required(),
      password: Yup.string().min(3).required()
    })

    let isValid = null
    try {
      isValid = await schemaCreateCompany.validate(req.body, { abortEarly: false })
    } catch (err) {

      res.locals.payload = {
        status: 400,
        code: 'validationError',
        body: err.errors
      }
      return next();
    }

    const {
      nameOwner,
      nameCompany,
      password,
      cnpj,
      cpf,
      address,
      contact
    } = isValid

    const validcnpj = validate(cnpj)

    if (!validcnpj) {
      res.locals.payload = {
        status: 400,
        code: 'cnpjInvalid'
      }
      return next();
    } 

    const validcpf = validarCpf(cpf)

    if (!validcpf) {
      res.locals.payload = {
        status: 400,
        code: 'cpfInvalid'
      }
      return next();
    }

    const companyExists = await Company.findOne({
      where: {
        cnpj
      }
    })

    if (companyExists) {
      res.locals.payload = {
        status: 400,
        code: 'companyAlreadyExists'
      }
      return next();
    }

    let employee = null

    Employee.findOrCreate({
      where: {
        cpf
      },
      defaults: {
        name: nameOwner,
        password_temp: password,
        role: 1
      }
    }).spread(async (user, created) => {
      employee = user

      const company = await Company.create({
        name: nameCompany,
        address,
        contact,
        cnpj
      })

      await CompanyEmployee.create({
        company_id: company.id,
        employee_id: employee.id,
        owner: true
      })

      res.locals.payload = {
        status: 200,
        code: 'createCompany',
        body: company
      }
      return next();
    })
  }

  async update (req, res, next) {
    if (req.employee.role !== 1) {

      res.locals.payload = {
        status: 400,
        code: 'noPermission'
      }
      return next();
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      address: Yup.string(),
      contact: Yup.string()
    })

    let isValid = null
    try {
      isValid = await schema.validate(req.body, { abortEarly: false })
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
      address,
      contact
    } = isValid

    const company = await Company.findOne({
      where: {
        id: req.employee.company.id
      }
    })

    if (name) company.name = name
    if (address) company.address = address
    if (contact) company.contact = contact

    await company.save()

    res.locals.payload = {
      status: 200,
      code: 'companyFound',
      body: company
    }
    return next();
  }

  async index (req, res, next) {
    const companies = await Company.findAll()

    if (companies < 1) {
      res.locals.payload = {
        status: 400,
        code: 'noCompaniesRegistered'
      }
      return next();
    }

    res.locals.payload = {
      status: 200,
      code: 'allCompaniesFound',
      body: companies
    }
    return next();
  }
}

module.exports = new CompanyController()
