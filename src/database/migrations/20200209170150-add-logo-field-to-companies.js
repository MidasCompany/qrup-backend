module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('companies', 'logo_id', {
		type: Sequelize.UUID,
		reference: { model: 'files', key: 'id' },
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
		allowNull: true,
	}),

	down: (queryInterface) => queryInterface.removeColumn('companies', 'logo_id'),
};
