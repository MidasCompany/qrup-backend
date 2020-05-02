const Sequelize = require('sequelize');
const User = require('./app/models/User');
const Company = require('./app/models/Company');
const Cup = require('./app/models/Cup');
const Employee = require('./app/models/Employee');
const Historic = require('./app/models/Historic');
const CompanyCoupons = require('./app/models/CompanyCoupons');
const UserPoints = require('./app/models/UserPoints');
const CompanyEmployee = require('./app/models/CompanyEmployee');

const databaseConfig = require('./config/database');

const models = [
	User, 
	Company, 
	Cup, 
	Employee, 
	Historic, 
	CompanyCoupons,
	UserPoints, 
	CompanyEmployee
];

class Database {
	constructor() {
		this.init();
		// this.mongo();
	}

	init() {
		this.connection = new Sequelize(databaseConfig[process.env.NODE_ENV]);
		models.map((model) => model.init(this.connection));
		models.map((model) => model.associate && model.associate(this.connection.models));
	}

	// mongo() {
	// this.mongoConnection = mongoose.connect(
	// 'mongodb://localhost:27017/qrup',
	// { useNewUrlParser: true, useFindAndModify: true }
	// )
	// }
}

module.exports = new Database();
