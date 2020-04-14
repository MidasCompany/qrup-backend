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
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		contact: {
			type: Sequelize.STRING,
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
		avatar_id: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: '/uploads/user/default-user.jpg'
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
