const Sequelize = require ('sequelize');

class Cup extends Sequelize.Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      description: Sequelize.STRING,
      type: Sequelize.STRING,
      qr: Sequelize.STRING,
      user_id:{ 
        type: Sequelize.UUID,
        allowNull: false
      },
    }, 
    {
      sequelize,
    });
    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
  }
}

module.exports = Cup;