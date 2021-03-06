'use strict'
const uuid = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const listCups = []

    for (let i = 0; i < 10; i++) {
      const uuid_p = uuid.v4()
      const qr = uuid_p.split('-')[0]

      listCups.push({
        id: uuid_p,
        qr,
        type: '400ml',
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    return queryInterface.bulkInsert('cups', listCups, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cups', null, {})
  }
}
