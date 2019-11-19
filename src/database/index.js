import Sequelize from 'sequelize';

import User from '../app/models/User';
import Company from '../app/models/Company';
import Cup from '../app/models/Cup';
import Employee from '../app/models/Employee';
import UserCupons from '../app/models/UserCupons';
import CompanyCupons from '../app/models/CompanyCupons';

import databaseConfig from '../config/database';



const models = [User, Company, Cup, Employee, UserCupons, CompanyCupons];

class Database {
  constructor(){
    this.init();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();