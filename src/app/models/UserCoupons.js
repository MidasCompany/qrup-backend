import Sequelize, { Model } from "sequelize";

class UserCoupons extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER
        },
        user_id: Sequelize.INTEGER,
        coupon_id: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default UserCoupons;
