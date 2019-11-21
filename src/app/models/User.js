import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
      contact: Sequelize.INTEGER,
      cpf: Sequelize.INTEGER,
      birth: Sequelize.DATE,
      points: Sequelize.INTEGER,
     // cup_id: Sequelize.STRING
    }, 
    {
      sequelize,
    });
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

//  checkPassword(password){
  //  return bcrypt.compare(password, this.password_hash);
  //}
}

export default User;