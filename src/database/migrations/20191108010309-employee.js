module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('employees', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		cpf: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		password_hash: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		company_id: {
			type: Sequelize.UUID,
			references: { model: 'companies', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		},
		owner: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		manager: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		employee: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
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

	down: (queryInterface, Sequelize) => queryInterface.dropTable('employees'),
};
