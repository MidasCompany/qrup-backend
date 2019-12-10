import Sequelize from "sequelize";

import User from "../app/models/User";
import Company from "../app/models/Company";
import Cup from "../app/models/Cup";
import Employee from "../app/models/Employee";
import UserCoupons from "../app/models/UserCoupons";
import CompanyCoupons from "../app/models/CompanyCoupons";

import databaseConfig from "../config/database";

const models = [User, Company, Cup, Employee, UserCoupons, CompanyCoupons];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
