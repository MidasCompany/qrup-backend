module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('employees', 'avatar_id', {
      type: Sequelize.UUID,
      reference: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('employees', 'avatar_id');
  },
};