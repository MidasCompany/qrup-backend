import Sequelize, { Model } from 'sequelize';

class CompanyCupons extends Model {
  static init(sequelize){
    super.init({
      company_id: Sequelize.INTEGER,
      points: Sequelize.INTEGER
    }, 
    {
      sequelize,
    });
    return this;
  }

}

export default CompanyCupons;