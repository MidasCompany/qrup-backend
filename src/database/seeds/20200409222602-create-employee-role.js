'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('employee_roles', [
      { name: 'Dono', created_at: new Date(), updated_at: new Date() },
      { name: 'Gerente', created_at: new Date(), updated_at: new Date() },
      { name: 'Funcionário', created_at: new Date(), updated_at: new Date() }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('employee_roles', null, {})
  }
}
