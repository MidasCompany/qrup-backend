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
      company_id: Sequelize.UUID,
      employee_type: Sequelize.ENUM('dono', 'gerente', 'empregado')
    }, 
    {
      sequelize,
    });
    return this;
  }

}

export default Employee;