const Sequelize = require('sequelize');

class CompanyPoints extends Sequelize.Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			company_id: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			total: Sequelize.INTEGER,
		},
		{
			sequelize,
		});
		return this;
	}

	static associate(models) {
		this.belongsTo(models.Company, { foreignKey: 'company_id' });
	}
}

module.exports = CompanyPoints;
