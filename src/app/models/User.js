const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4,
					primaryKey: true,
				},
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				password: Sequelize.STRING,
				contact: Sequelize.STRING,
				cpf: Sequelize.STRING,
				birth: Sequelize.DATE,
			},
			{
				sequelize,
			},
		);

		this.addHook('beforeSave', async (user) => {
			if (user.password) {
				user.password = await bcrypt.hash(user.password, 8);
			}
		});

		return this;
	}



	static associate(models) {
		this.hasMany(models.Cup, { foreignKey: 'id' });
		this.hasMany(models.Historic, { foreignKey: 'user_id', as: 'historic' });
		this.hasOne(models.UserPoints, { foreignKey: 'user_id', as: 'points' });
		this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
	}

	checkPassword(password) {
		return bcrypt.compare(password, this.password);
	}
}

module.exports = User;
