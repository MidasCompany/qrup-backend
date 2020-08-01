const Yup = require('yup')
const User = require('../models/User')
const validarCpf = require('validar-cpf')
const UserPoints = require('../models/UserPoints')
const { Op } = require('sequelize')

class UserController {
  async store (req, res, next) {
    const schemaUserStore = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      cpf: Yup.string().length(11).required(),
      password: Yup.string().min(4).required(),
      birth: Yup.date().required(),
      contact: Yup.string().default('00000000')
    })

    let isValid = null
    try {
      isValid = await schemaUserStore.validate(req.body, { abortEarly: false })
    } catch (err) {
      res.locals.payload = {
        status: 400,
        code: 'validationError',
        body: err.errors
      }
      return next()
    }

    const {
      name,
      email,
      cpf,
      password,
      birth,
      contact
    } = isValid

    const validcpf = validarCpf(cpf)

    if (!validcpf) {
      res.locals.payload = {
        status: 400,
        code: 'cpfInvalid'
      }
      return next()
    }

    const userExists = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { cpf }
        ]
      }
    })

    if (userExists) {
      res.locals.payload = {
        status: 400,
        code: 'userAlreadyExists'
      }
      return next()
    }

    const user = await User.create({
      name,
      email,
      cpf,
      password_temp: password,
      birth,
      contact
    })
    await UserPoints.create({ user_id: user.id })

    res.locals.payload = {
      status: 200,
      code: 'userCreated',
      body: user
    }
    return next()
  }

  async update (req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      contact: Yup.string(),
      oldPassword: Yup.string().min(3),
      password: Yup.string().min(3).when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field))
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
      return next()
    }

    const {
      email,
      name,
      oldPassword,
      password,
      contact
    } = isValid

    const user = req.user

    if (email && email !== user.email) {
      user.email = email
    }

    if (name && name !== user.name) {
      user.name = name
    }

    if (contact && contact !== user.contact) {
      user.contact = contact
    }

    if (oldPassword && await user.checkPassword(oldPassword)) {
      user.password_temp = password
    } else if (oldPassword) {
      res.locals.payload = {
        status: 400,
        code: 'passwordDoesNotMatch'
      }
      return next()
    }

    await user.save()

    res.locals.payload = {
      status: 200,
      code: 'userUpdated',
      body: user
    }
    return next()
  }

  async index (req, res, next) {
    const users = await User.findOne({
      where: { id: req.params.user_id },
      include: [
        {
          model: UserPoints,
          as: 'points'
        }
      ]
    })

    if (users < 1) {
      res.locals.payload = {
        status: 400,
        code: 'noUsersRegistered'
      }
      return next()
    }

    res.locals.payload = {
      status: 200,
      code: 'userFound',
      body: users
    }
    return res.json(users)
  }
}

module.exports = new UserController()
