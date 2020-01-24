module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("company_coupons", {
      id: {
        type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
      },
      company_id: {
        type: Sequelize.UUID,
        references: { model: "companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      points: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable("company-coupons");
  }
};
