const Sequelize = require('sequelize');

class UserPoints extends Sequelize.Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			total: Sequelize.INTEGER,
		},
		{
			sequelize,
		});
		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id' });
	}
}

module.exports = UserPoints;
