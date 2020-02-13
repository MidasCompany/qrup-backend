import Sequelize from "sequelize";
import mongoose from 'mongoose';

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
    //this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(model => model.associate && model.associate(this.connection.models));
  }

  //mongo() {
    //this.mongoConnection = mongoose.connect(
      //'mongodb://localhost:27017/qrup',
      //{ useNewUrlParser: true, useFindAndModify: true } 
      //)
  //}
}

export default new Database();