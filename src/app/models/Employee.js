const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

class Employee extends Sequelize.Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			name: Sequelize.STRING,
			cpf: Sequelize.STRING,
			role: Sequelize.INTEGER,
			password: Sequelize.STRING,
			password_temp: Sequelize.VIRTUAL,
			avatar_id: Sequelize.STRING,
			company_id: Sequelize.UUID
		},
		{
			sequelize,
		});

		this.addHook('beforeSave', async (employee) => {
			console.log(employee)
			if (employee.password_temp) {
				employee.password = await bcrypt.hash(employee.password_temp, 8);
			}
		});

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
	}

	checkPassword(password) {
		return bcrypt.compare(password, this.password);
	}
}

module.exports = Employee;
