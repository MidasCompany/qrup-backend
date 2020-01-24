import Sequelize, { Model } from 'sequelize';

class Company extends Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
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
  static associate(models) {
    this.hasMany(models.Employee, { foreignKey: 'id'});
    this.hasMany(models.CompanyCoupons, { foreignKey: 'id'});
  }
}

export default Company;