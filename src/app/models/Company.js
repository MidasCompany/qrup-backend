import Sequelize, { Model } from 'sequelize';

class Company extends Model {
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      address: Sequelize.STRING,
      password_hash: Sequelize.STRING,
      contact: Sequelize.INTEGER,
      cnpj: Sequelize.INTEGER,
      representative: Sequelize.STRING,
    }, 
    {
      sequelize,
    });
  }
}

export default Company;