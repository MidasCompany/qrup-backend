import Sequelize, { Model } from 'sequelize';

class CompanyCupons extends Model {
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

}

export default CompanyCupons;