import Sequelize, { Model } from 'sequelize';
import bcrypt from "bcryptjs";

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
      password: Sequelize.VIRTUAL,
      contact: Sequelize.INTEGER,
      cnpj: Sequelize.INTEGER,
      representative: Sequelize.STRING,
    }, 
    {
      sequelize,
    });

    this.addHook("beforeSave", async company => {
      if (company.password) {
        company.password_hash = await bcrypt.hash(company.password, 8);
      } 
    });

    return this;
  
  }

  static associate(models) {
    this.hasMany(models.Employee, { foreignKey: 'id'});
    this.hasMany(models.CompanyCoupons, { foreignKey: 'id'});
    this.belongsTo(models.File, { foreignKey: 'logo_id'});
  }
}

export default Company;