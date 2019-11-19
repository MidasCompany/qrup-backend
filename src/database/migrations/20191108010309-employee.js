module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('employees', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false, 
          autoIncrement: true,
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
        company_id: {
          type: Sequelize.INTEGER, 
          references: {model: 'companies', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',  
          allowNull: false     
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
      return queryInterface.dropTable('employees');
  }
};
