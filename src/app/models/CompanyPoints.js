import Sequelize, { Model } from "sequelize";

export default class CompanyPoints extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        company_id: Sequelize.UUID,
        balance: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}
