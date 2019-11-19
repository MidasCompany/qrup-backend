module.exports = {
  up: (queryInterface, Sequelize) => {
      Example:
      return queryInterface.createTable('company_cupons', { 
        id: {
          type: Sequelize.INTEGER, 
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        }, 
        company_id: {
          type: Sequelize.INTEGER, 
          references: {model: 'companies', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL' 
        },
        points: {
          type: Sequelize.INTEGER,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  down: (queryInterface, Sequelize) => {
      Example:
      return queryInterface.dropTable('company-cupons');
  }
};
