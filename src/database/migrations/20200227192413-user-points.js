module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('user-points', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		total: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		user_id: {
			type: Sequelize.UUID,
			references: { model: 'users', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
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

	down: (queryInterface, Sequelize) => queryInterface.dropTable('user-points'),
};