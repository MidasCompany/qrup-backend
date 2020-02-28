module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('user_coupons', {
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
		coupom_id: {
			type: Sequelize.UUID,
			references: { model: 'company_coupons', key: 'id' },
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

	down: (queryInterface, Sequelize) => queryInterface.dropTable('user_coupons'),
};
