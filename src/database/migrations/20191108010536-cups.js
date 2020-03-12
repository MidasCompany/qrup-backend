module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('cups', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		description: {
			type: Sequelize.STRING,
		},
		user_id: {
			type: Sequelize.UUID,
			references: { model: 'users', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		},
		type: {
			type: Sequelize.STRING,
		},
		qr: {
			type: Sequelize.STRING,
		},
		active: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
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
			type: Sequelize.DATE
		}

	},{
		paranoid: true,
	}),

	down: (queryInterface, Sequelize) => queryInterface.dropTable('cups'),
};
