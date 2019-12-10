import Sequelize, { Model } from "sequelize";

class UserCoupons extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        user_id: Sequelize.INTEGER,
        balance: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default UserCoupons;
