module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('user_points', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.UUID,
			references: { model: 'users', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		total: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
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

	down: (queryInterface, Sequelize) => queryInterface.dropTable('user_points'),
};
