module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('employees', 'avatar_id', {
		type: Sequelize.UUID,
		reference: { model: 'files', key: 'id' },
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
		allowNull: true,
	}),

	down: (queryInterface) => queryInterface.removeColumn('employees', 'avatar_id'),
};
