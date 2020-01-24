import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        contact: Sequelize.INTEGER,
        cpf: Sequelize.INTEGER,
        birth: Sequelize.DATE,
        points: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    this.addHook("beforeSave", async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Cup, { foreignKey: 'id'});
    this.hasMany(models.UserCoupons, { foreignKey: 'id'});
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
