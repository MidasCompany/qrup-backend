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
			type: Sequelize.STRING,
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		company_id: {
			type: Sequelize.UUID,
			references: { model: 'companies', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		role: {
			type: Sequelize.INTEGER,
			defaultValue: 3,
			references: {
				model: 'employee_roles',
				key: 'id'
			},
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
