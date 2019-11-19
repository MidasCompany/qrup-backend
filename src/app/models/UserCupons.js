import Sequelize, { Model } from 'sequelize';

class UserCupons extends Model {
  static init(sequelize){
    super.init({
      user_id: Sequelize.INTEGER,
      cupom_id: Sequelize.INTEGER
    }, 
    {
      sequelize,
    });
    return this;
  }

}

export default UserCupons;