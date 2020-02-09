import Sequelize, { Model } from 'sequelize';

class UserCoupons extends Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      coupom_id: Sequelize.UUID
    }, 
    {
      sequelize,
    });
    return this;
  } 
  
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
    this.belongsTo(models.CompanyCoupons, { foreignKey: 'coupom_id'});
  }
}

export default UserCoupons;