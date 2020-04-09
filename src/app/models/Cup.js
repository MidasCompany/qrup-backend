const Sequelize = require('sequelize');

class Cup extends Sequelize.Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			description: Sequelize.STRING,
			type: Sequelize.STRING,
			qr: Sequelize.STRING,
			enabled: Sequelize.BOOLEAN,
			user_id: Sequelize.UUID,
		},
		{
			paranoid: true,
			sequelize,
		});

		this.beforeCreate( async (cup) => {
			cup.qr = cup.id.split('-')[0];
		})

		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id' });
	}
}

module.exports = Cup;
