module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('companies', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		address: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		contact: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		cnpj: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		avatar_id: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: '/uploads/company/default-company.jpg'
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

	down: (queryInterface, Sequelize) => queryInterface.dropTable('companies'),
};
