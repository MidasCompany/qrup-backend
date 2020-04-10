const Sequelize = require('sequelize');

class Historic extends Sequelize.Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			user_id: Sequelize.UUID,
			company_id: Sequelize.UUID,
			coupon_id: Sequelize.UUID,
			points: Sequelize.INTEGER,
			mode: Sequelize.ENUM('add', 'rem')
		},
		{
			sequelize,
		});
		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
		this.belongsTo(models.CompanyCoupons, { foreignKey: 'coupon_id', as: 'coupon' });
	}
}

module.exports = Historic;
