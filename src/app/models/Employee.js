import Sequelize, { Model } from 'sequelize';

class Employee extends Model {
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      cpf: Sequelize.INTEGER,
      company_id: Sequelize.INTEGER
    }, 
    {
      sequelize,
    });
    return this;
  }

}

export default Employee;