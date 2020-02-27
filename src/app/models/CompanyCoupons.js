const Sequelize = require ('sequelize');

class CompanyCoupons extends Sequelize.Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      }, 
      company_id: Sequelize.UUID,
      points: Sequelize.INTEGER
    }, 
    {
      sequelize,
    });
    return this;
  }
  static associate(models) {
    this.hasOne(models.UserCoupons, { foreignKey: 'id'});
    this.belongsTo(models.Company, { foreignKey: 'company_id'});
  }

}

module.exports = CompanyCoupons;