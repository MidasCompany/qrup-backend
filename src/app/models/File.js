import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize){
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `http://localhost:3333/files/${this.path}`;
        },
      },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'id', as: 'avatar'});
    this.hasMany(models.Employee, { foreignKey: 'id'});
    this.hasMany(models.Company, { foreignKey: 'id'});
  }
}

export default File;