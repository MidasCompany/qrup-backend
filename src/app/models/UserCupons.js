import Sequelize, { Model } from 'sequelize';

class UserCupons extends Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: Sequelize.UUID,
      cupom_id: Sequelize.UUID
    }, 
    {
      sequelize,
    });
    return this;
  }

}

export default UserCupons;