const Sequelize = require('sequelize');

class CompanyEmployee extends Sequelize.Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			company_id: Sequelize.UUID,
			employee_id: Sequelize.UUID,
			owner: Sequelize.BOOLEAN,
		},
			{
				sequelize,
			});
		return this;
	}

	static associate(models) {
		this.hasMany(models.Employee, { foreignKey: 'id', sourceKey: 'employee_id', as: 'employee' });
		this.hasMany(models.Company, { foreignKey: 'id', sourceKey: 'company_id', as: 'company' })
	}
}

module.exports = CompanyEmployee;
