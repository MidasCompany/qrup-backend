const Sequelize = require ("sequelize");
const mongoose = require ('mongoose');

const User = require ('./app/models/User');
const Company = require ('./app/models/Company');
const Cup = require ('./app/models/Cup');
const Employee = require ('./app/models/Employee');
const UserCoupons = require ('./app/models/UserCoupons');
const CompanyCoupons = require ('./app/models/CompanyCoupons');
const File = require ('./app/models/File');
const CompanyPoints = require ('./app/models/CompanyPoints');
const UserPoints = require ('./app/models/UserPoints');

const databaseConfig = require ("./config/database");

const models = [User, Company, Cup, Employee, UserCoupons, CompanyCoupons, CompanyPoints, UserPoints, File];

class Database {
  constructor() {
    this.init();
    //this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig.development);
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

module.exports = new Database();