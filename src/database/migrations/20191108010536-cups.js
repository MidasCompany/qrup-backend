module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('cups', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.UUID,
			references: { model: 'users', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		},
		description: {
			type: Sequelize.STRING,
		},
		type: {
			type: Sequelize.STRING,
		},
		qr: {
			type: Sequelize.STRING,
		},
		enabled: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		deleted_at: {
			type: Sequelize.DATE,
		}
	}),

	down: (queryInterface, Sequelize) => queryInterface.dropTable('cups'),
};
