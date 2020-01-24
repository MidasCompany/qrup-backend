module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user-coupons", {
      id: {
        type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      coupom_id: {
        type: Sequelize.UUID,
        references: { model: "company_coupons", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user-coupons");
  }
};
