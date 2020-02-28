module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('files', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		path: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
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

	down: (queryInterface) => queryInterface.dropTable('files'),
};
