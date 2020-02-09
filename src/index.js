import Sequelize from "sequelize";

import User from './app/models/User';
import Company from './app/models/Company';
import Cup from './app/models/Cup';
import Employee from './app/models/Employee';
import UserCoupons from './app/models/UserCoupons';
import CompanyCoupons from './app/models/CompanyCoupons';
import File from './app/models/File';

import databaseConfig from "./config/database";

const models = [User, Company, Cup, Employee, UserCoupons, CompanyCoupons, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();