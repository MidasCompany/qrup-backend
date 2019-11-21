import Sequelize, { Model } from 'sequelize';

class Cup extends Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
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