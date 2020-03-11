module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		password_hash: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		contact: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		cpf: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		birth: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
	}),

	down: (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
