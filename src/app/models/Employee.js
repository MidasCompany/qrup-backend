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
			company_id: Sequelize.UUID
		},
		{
			sequelize,
		});

		this.addHook('beforeSave', async (employee) => {
			if (employee.password) {
				employee.password = await bcrypt.hash(employee.password, 8);
			}
		});

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
		this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
	}

	checkPassword(password) {
		return bcrypt.compare(password, this.password_hash);
	}
}

module.exports = Employee;
