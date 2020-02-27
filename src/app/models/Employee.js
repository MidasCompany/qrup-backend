const Sequelize = require ('sequelize');
const bcrypt = require ("bcryptjs");

class Employee extends Sequelize.Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      cpf: Sequelize.INTEGER,
      owner: Sequelize.BOOLEAN,
      manager: Sequelize.BOOLEAN,
      employee: Sequelize.BOOLEAN,
      password_hash: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      company_id:{ 
        type: Sequelize.UUID,
        allowNull: false
      },
    }, 
    {
      sequelize,
    });

    this.addHook("beforeSave", async employee => {
      if (employee.password) {
        employee.password_hash = await bcrypt.hash(employee.password, 8);
      } 
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id'});
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar'});
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = Employee;