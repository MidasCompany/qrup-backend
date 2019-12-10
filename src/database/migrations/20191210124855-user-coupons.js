module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user-coupon", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        references: { model: "company_coupons", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user-coupon");
  }
};
