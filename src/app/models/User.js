const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

class User extends Sequelize.Model {
  static init (sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      password_temp: Sequelize.VIRTUAL,
      contact: Sequelize.STRING,
      cpf: Sequelize.STRING,
      birth: Sequelize.DATE,
      avatar_id: Sequelize.STRING
    }, {
      sequelize
    })

    this.addHook('beforeSave', async (user) => {
      if (user.password_temp) {
        user.password = await bcrypt.hash(user.password_temp, 8)
      }
    })

    return this
  }

  static associate (models) {
    this.hasMany(models.Cup, { foreignKey: 'id' })
    this.hasMany(models.Historic, { foreignKey: 'user_id', as: 'historic' })
    this.hasOne(models.UserPoints, { foreignKey: 'user_id', as: 'points' })
  }

  checkPassword (password) {
    return bcrypt.compare(password, this.password)
  }
}

module.exports = User
