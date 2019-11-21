module.exports = {
  up: (queryInterface, Sequelize) => {
      Example:
      return queryInterface.createTable('user_cupons', { 
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID, 
          references: {model: 'users', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL' 
        },
        cupom_id: {
          type: Sequelize.UUID,  
          references: {model: 'company_cupons', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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
      return queryInterface.dropTable('user-cupons');
  }
};
