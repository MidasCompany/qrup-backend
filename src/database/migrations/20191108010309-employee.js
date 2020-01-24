module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("employees", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      company_id: {
        type: Sequelize.UUID,
        references: { model: "companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      employee_type: {
        type: Sequelize.ENUM("dono", "gerente", "empregado"),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("employees");
  }
};
