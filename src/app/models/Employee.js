import Sequelize, { Model } from 'sequelize';

class Employee extends Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      cpf: Sequelize.INTEGER,
      company_id:{ 
        type: Sequelize.UUID,
        allowNull: false
      },
      employee_type: Sequelize.ENUM('dono', 'gerente', 'empregado')
    }, 
    {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id'});
    this.belongsTo(models.File, { foreignKey: 'avatar_id'});
  }
}

export default Employee;