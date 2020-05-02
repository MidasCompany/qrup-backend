module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('company_employees', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		company_id:{
			type: Sequelize.UUID,
			references: { model: 'companies', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		employee_id: {
			type: Sequelize.UUID,
			references: { model: 'employees', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		owner: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
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

	down: (queryInterface, Sequelize) => queryInterface.dropTable('company_employees'),
};
