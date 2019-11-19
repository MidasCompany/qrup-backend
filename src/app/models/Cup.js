import Sequelize, { Model } from 'sequelize';

class Cup extends Model {
  static init(sequelize){
    super.init({
      description: Sequelize.STRING,
      type: Sequelize.STRING,
      qr: Sequelize.STRING
    }, 
    {
      sequelize,
    });
    return this;
  }
}

export default Cup;