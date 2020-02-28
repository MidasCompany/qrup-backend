module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatar_id', {
		type: Sequelize.UUID,
		reference: { model: 'files', key: 'id' },
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
		allowNull: true,
	}),

	down: (queryInterface) => queryInterface.removeColumn('users', 'avatar_id'),
};
